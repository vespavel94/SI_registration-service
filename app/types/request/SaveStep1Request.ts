interface SaveStep1Request {
    form: {
        isIIS: boolean
        IISWarningApproved: boolean
        isEBS: boolean
        selectedBoards: {[key: string]: boolean }
        selectedFilial: string
        selectedFilialCode: number
        birthday: string
        passportSeries: string
        passportNumber: string
        passportDate: string
        passportOrgName: string
        passportBirthPlace: string
        passportOrgCode: string
        inn: string
        addressOff: string
        addressPost: string
        compliance: boolean
        fileScan1: string
        fileScan2: string
        smsCode: string
    },
    sessionId: string
}

export default SaveStep1Request