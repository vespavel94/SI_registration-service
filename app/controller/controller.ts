import { Request, Response } from 'express'
import {
    CreateLeadRequest,
    SendSmsCodeRequest,
    SaveStep1Request,
    SaveStep2Request
} from '../types/request/general'
import ApiResponse from '../types/response/ApiResponse'
import rabbit from '../rabbit/rabbit'

const controllers = {
    async loadInitialData(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)

        try {
            const filials: Array<object> = (await rabbit.sendRequestPromised('getFilialsList', {})).filialsList
            const strategies: Array<object> = (await rabbit.sendRequestPromised('getStrategiesList', {})).strategiesList
            apiResponse.okResponse('Initial data loaded successfully',
                { filials, strategies, defaultFilial: 17 })
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
        console.log('asdasdad')

        try {
            await rabbit.sendRequestPromised('saveStep2', step2Data)
            apiResponse.okResponse('Step 2 signed Successfully', null)
        } catch (err) {
            apiResponse.errorResponse(400, err.message)
        } finally {
            apiResponse.json()
        }
    }
}

export default controllers