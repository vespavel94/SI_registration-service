class UTMMeta {
    utm_medium: string
    utm_source: string
    utm_content: string
    assigned_by_id: number
    constructor (osType: any) {
        this.utm_medium = 'app'
        this.utm_source = `investor-${osType.toLowerCase()}-native`
        this.utm_content = ''
        this.assigned_by_id = 1
    }
}

export default UTMMeta