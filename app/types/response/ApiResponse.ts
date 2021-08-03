import { Request, Response } from 'express'

interface OkResponseBody {
    result: boolean,
    message: string,
    data: any
}

interface ErrorResponseBody {
    result: boolean,
    message: string
}

class ApiResponse {
    req: Request
    res: Response
    body: OkResponseBody | ErrorResponseBody
    statusCode: number
    constructor(req: Request, res: Response) {
        this.req = req
        this.res = res
        this.body = { result: true, message: '', data: null}
        this.statusCode = 200
        this.res.setHeader('Access-Control-Allow-Origin', '*')
        this.res.setHeader('Access-Control-Allow-Credentials', 'true')
        this.res.setHeader('Content-Type', 'application/json')
    }

    status(statusCode: number) {
        this.statusCode = statusCode
        this.res.status(statusCode)
    }

    json() {
        this.res.end(JSON.stringify(this.body))
    }

    okResponse( message: string, data: any) {
        this.body = {
            result: true,
            message,
            data
        }
    }

    errorResponse(statusCode: number, errMessage: string) {
        this.status(statusCode)
        this.body = {
            result: false,
            message: errMessage
        }
    }
}

export default ApiResponse
