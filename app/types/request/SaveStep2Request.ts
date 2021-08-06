interface SaveStep2Request {
    form: {
        addressOff: string
        addressPost: string
        snils: string
        compliance: boolean
        fileScan1: string
        fileScan2: string
        smsCode: string
    },
    sessionId: string
}

export default SaveStep2Request