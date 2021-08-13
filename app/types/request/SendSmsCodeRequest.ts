interface SendSmsCodeRequest {
    mobile: string,
    sessionId: number | null,
    step: number,
    encrypt?: boolean
}

export default SendSmsCodeRequest