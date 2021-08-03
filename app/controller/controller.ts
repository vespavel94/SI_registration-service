import { Request, Response } from 'express'
import { CreateLeadRequest, SendSmsCodeRequest } from '../types/request/general'
import ApiResponse from '../types/response/ApiResponse'
import rabbit from '../rabbit/rabbit'

const controllers = {
    async loadInitialData (req: Request, res: Response) {
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
    }
}

export default controllers