type Currency = 'RUB' | 'ADD_RUB' | 'USD' | 'EUR'

interface SaveStep2Request {
    form: {
        selectedCurrency: Currency
        bankBIK: string
        bankName: string
        bankAccountNum: string
        bankAccountHolder: string
        bankFileScan: string
        smsCode: string
    },
    sessionId: string,
    pushServiceToken: string
}

export default SaveStep2Request