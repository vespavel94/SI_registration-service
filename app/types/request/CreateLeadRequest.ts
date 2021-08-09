interface CreateLeadRequest {
    form: {
        firstName: string
        lastName: string
        middleName: string
        email: string
        mobile: string
        smsCode: string
    }
}

export default CreateLeadRequest