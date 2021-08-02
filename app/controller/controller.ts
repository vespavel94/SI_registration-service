import { Request, Response } from 'express'
import { CreateLeadRequest } from '../types/request/general'
import ApiResponse from '../types/response/ApiResponse'
import rabbit from '../rabbit/rabbit'

// const rabbit = new Rabbit()

const controllers = {
    async loadInitialData (req: Request, res: Response) {
        console.log('kek')
        const apiResponse = new ApiResponse(req, res)
        try {
            const list = await rabbit.sendRequestPromised('getFilialsList', {})
            console.log(list)
        } catch (err) {
            console.log(err)
        } finally {
            apiResponse.json()
        }
    },

    async createLead(req: Request, res: Response) {
        const apiResponse = new ApiResponse(req, res)
        const formData: CreateLeadRequest = req.body

        try {
            console.log(formData)
            apiResponse.okResponse('', 'ok')
        } catch (err) {
            apiResponse.errorResponse(400, err) 
        } finally {
            apiResponse.json()
        }
    }
}

export default controllers