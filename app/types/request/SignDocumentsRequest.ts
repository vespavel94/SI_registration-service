interface SignDocumentsRequest {
    sessionId: number,
    timestamp: string,
    encrypt?: boolean,
    smsCode: string
}

export default SignDocumentsRequest