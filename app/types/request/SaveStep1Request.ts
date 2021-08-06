interface SaveStep1Request {
    form: {
        lastName: string
        firstName: string
        middleName: string
        birthday: string
        passportSeries: string
        passportNumber: string
        passportDate: string
        passportOrgName: string
        passportOrgCode: string
        inn: string
        mobile: string
        email: string
        isIIS: boolean,
        IISWarningApproved: boolean
        selectedFilial: string
        selectedFilialCode: number
        isDU: false
        selectedDUStrategy: number
        selectedDUStrategyLabel: string
        smsCode: string
    },
    sessionId: string
}

export default SaveStep1Request