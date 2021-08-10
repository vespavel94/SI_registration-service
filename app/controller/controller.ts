import { Request, Response } from 'express'
import {
    CreateLeadRequest,
    SendSmsCodeRequest,
    SaveStep1Request,
    SaveStep2Request
} from '../types/request/general'
import ApiResponse from '../types/response/ApiResponse'
import rabbit from '../rabbit/rabbit'

const debug = true

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
            apiResponse.okResponse('Initial data loaded successfully',
                { filials, defaultFilial: 17, secBoardsArr })
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    },

    async createLead(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const formData: CreateLeadRequest = req.body

        try {
            if (debug) {
                apiResponse.okResponse('Create lead succeed', {
                    status: 'NEW',
                    sessionId: 'U2FsdGVkX1+zYe3GXHLFtoBETxqj81aMHMAPK0UBt8fyERYzJZ0BAsR1PGMh7VJZ'
                })
                return
            }
            
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

        try {
            if (debug) {
                apiResponse.okResponse('Step 1 signed Successfully', null)
                return
            }

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

        try {
            if (debug) {
                apiResponse.okResponse('Step 2 signed Successfully', null)
                return
            }

            await rabbit.sendRequestPromised('saveStep2', step2Data)

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
        const sessionId: string = req.params.sessionId

        try {
            if (debug) {
                apiResponse.okResponse('Session status recieved succefully', { status: 'SMEV_PROCESSING' })
                return
            }
            const response = await rabbit.sendRequestPromised('getSessionStatus', { sessionId })
            apiResponse.okResponse('Session status recieved succefully', response)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    }
}

export default controllers