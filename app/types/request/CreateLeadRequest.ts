interface CreateLeadRequest {
    form: {
        firstName: string
        lastName: string
        middleName: string
        email: string
        mobile: string
        utm_medium: string
        utm_source: string
        utm_content: string
        assigned_by_id: number
    }
    encrypt?: boolean
}

export default CreateLeadRequest