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
        utm_medium: string
        utm_source: string
        utm_content: string
        assigned_by_id: number
    },
    sessionId: number
    pushServiceToken: string
    encrypt?: boolean
}

export default SaveStep2Request