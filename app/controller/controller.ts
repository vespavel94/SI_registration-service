import { Request, Response } from 'express'
import {
    CreateLeadRequest,
    SendSmsCodeRequest,
    SaveStep1Request,
    SaveStep2Request,
    UTMMeta,
    SignDocumentsRequest
} from '../types/request/general'
import ApiResponse from '../types/response/ApiResponse'
import rabbit from '../rabbit/rabbit'
import * as fs from 'fs'

const debug = true
const timers: { [key: string]: any } = {}

const controllers = {
    async loadInitialData(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)

        try {
            const filials: Array<object> = (await rabbit.sendRequestPromised('getFilialsList', {})).filialsList
            const secBoardsArr: Array<any> = [
                {
                    label: 'Фондовый рынок ПАО Московкая биржа',
                    value: "FOND",
                    default: true
                },
                {
                    label: 'Срочный рынок ПАО Московкая биржа (требуется подключение к Фондовому рынку)',
                    value: 'FORTS',
                    default: true
                },
                {
                    label: 'Валютный рынок ПАО Московкая биржа',
                    value: "CUR",
                    default: true
                },
                {
                    label: 'Рынок акций (иностранные ценные бумаги) ПАО "Санкт-Петербургская Биржа"',
                    value: "SPB",
                    default: true
                }
            ]
            const availableCurrency: Array<any> = [
                { label: 'Рубль РФ', value: 'RUB' },
                { label: 'Дополнительный. Рубль', value: 'ADD_RUB' },
                { label: 'Доллар США', value: 'USD' },
                { label: 'Евро', value: 'EUR' },
            ]
            apiResponse.okResponse('Initial data loaded successfully',
                { filials, defaultFilial: 17, secBoardsArr, availableCurrency, defaultCurrency: 'RUB' })
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async createLead(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const formData: CreateLeadRequest = req.body
        formData.form = { ...formData.form, ...new UTMMeta(req.headers['x-os-type']) }
        formData.encrypt = false

        try {
            // if (debug) {
            //     apiResponse.okResponse('Create lead succeed', {
            //         status: 'NEW',
            //         sessionId: 'U2FsdGVkX1+zYe3GXHLFtoBETxqj81aMHMAPK0UBt8fyERYzJZ0BAsR1PGMh7VJZ'
            //     })
            //     return
            // }

            const response = await rabbit.sendRequestPromised('createLead', formData)
            apiResponse.okResponse('Create lead succeed', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async sendSmsCode(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const smsData: SendSmsCodeRequest = req.body
        smsData.mobile = smsData.mobile.replace(/[^\d]/g, '')
        smsData.encrypt = false

        // if (debug && smsData.step === 42) smsData.step = 3 

        try {
            const response = await rabbit.sendRequestPromised('sendSmsCode', smsData)
            apiResponse.okResponse('Sms code sent successfully', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async saveStep1(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const step1Data: SaveStep1Request = req.body
        step1Data.form = { ...step1Data.form, ...new UTMMeta(req.headers['x-os-type']) }
        step1Data.encrypt = false
        try {
            // if (debug) {
            //     apiResponse.okResponse('Step 1 signed Successfully', null)
            //     return
            // }

            await rabbit.sendRequestPromised('saveStep1', step1Data)
            apiResponse.okResponse('Step 1 signed Successfully', null)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async saveStep2(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const step2Data: SaveStep2Request = req.body
        step2Data.form = { ...step2Data.form, ...new UTMMeta(req.headers['x-os-type']) }
        step2Data.encrypt = false

        const rabbitRequest: any = {
            form: {
                accounts: [
                    {
                        selectedCurrency: step2Data.form.selectedCurrency,
                        bankBIK: step2Data.form.bankBIK,
                        bankName: step2Data.form.bankName,
                        bankAccountNum: step2Data.form.bankAccountNum,
                        bankAccountHolder: step2Data.form.bankAccountHolder,
                        bankFileScan: step2Data.form.bankFileScan
                    }
                ],
                smsCode: step2Data.form.smsCode,
                ...new UTMMeta(req.headers['x-os-type']),
            },
            sessionId: step2Data.sessionId,
            pushServiceToken: step2Data.pushServiceToken,
            encrypt: false
        }
        try {
            // if (debug) {
            //     apiResponse.okResponse('Step 2 signed Successfully', null)
            //     const index: string = step2Data.sessionId.toString()
            //     timers[index] = 'SMEV_PROCESSING'
            //     setTimeout(() => {
            //         timers[index] = 'MIDDLE_PROCESSING'
            //         setTimeout(() => {
            //             timers[index] = 'SIGN_REQUIRED'
            //         }, 10000)
            //     }, 10000)
            //     return
            // }

            await rabbit.sendRequestPromised('saveStep2', rabbitRequest)

            if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
                await rabbit.sendRequestPromised('saveNotificationToken', {
                    sessionId: step2Data.sessionId,
                    pushServiceToken: step2Data.pushServiceToken,
                    pushServiceType: req.headers['x-push-type'] ?? 'fcm',
                    osType: req.headers['x-os-type']
                })
            }

            apiResponse.okResponse('Step 2 signed Successfully', null)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async getSessionStatus(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const sessionId: number = parseInt(req.params.sessionId)

        try {
            if (debug) {
                if (!timers[sessionId.toString()]) throw new Error('Session not found')
                apiResponse.okResponse('Session status recieved succefully', { status: timers[sessionId.toString()] })
                return
            }
            const response = await rabbit.sendRequestPromised('getSessionStatus', { sessionId })
            apiResponse.okResponse('Session status recieved succefully', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async getDocumentsToSign(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const sessionId: number = parseInt(req.params.sessionId)

        try {
            // if (debug) {
            //     const res = await fs.promises.readFile('test.zip')
            //     const data = 'data:application/zip;base64,' + Buffer.from(res).toString('base64')

            //     // let base64Data = Buffer.from(res).toString('base64')
            //     // await fs.promises.writeFile('out.zip', base64Data, {encoding: 'base64'});

            //     apiResponse.okResponse('Documents package recieved succefully', { documents: data })
            //     return
            // }
            const response = await rabbit.sendRequestPromised('getDocumentsToSignMobile', { sessionId, encrypt: false })
            apiResponse.okResponse('Documents package recieved succefully', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async signDocuments(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const signDocumentsData: SignDocumentsRequest = req.body
        signDocumentsData.encrypt = false

        try {
            if (debug) {
                const username = Math.floor(10000 + Math.random() * 90000).toString() + '-01'
                apiResponse.okResponse('Documents package signed succefully', { username })
                return
            }
            const response = await rabbit.sendRequestPromised('acceptMobile', signDocumentsData)
            apiResponse.okResponse('Documents package signed succefully', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    }
}

export default controllers