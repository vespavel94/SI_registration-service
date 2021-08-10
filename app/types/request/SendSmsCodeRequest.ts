interface SendSmsCodeRequest {
    mobile: string,
    sessionId: string,
    step: number,
    encrypt?: boolean
}

export default SendSmsCodeRequest