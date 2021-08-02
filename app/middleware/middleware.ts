import { Request, Response, NextFunction } from 'express'
import paramChecker from '../utils/paramChecker'
import ApiResponse from '../types/response/ApiResponse'

const checkParams = (req: Request, res: Response, next: NextFunction) => {
    const checkResult = paramChecker(req)
    if (checkResult.success) {
        next()
    } else {
        const apiResponse = new ApiResponse(req, res)
        apiResponse.errorResponse(400, checkResult.error)
        apiResponse.json()
    }
}

export {
    checkParams
}