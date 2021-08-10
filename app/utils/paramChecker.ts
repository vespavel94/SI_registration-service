const checkPhone = /^\(9[0-9]{2}\) [0-9]{3}-[0-9]{4}$/

interface CheckResult {
    success: boolean,
    error: string
}

class Param {
    name: string
    description: string
    mandatory: boolean
    nullable: boolean
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean) {
        this.name = name
        this.description = description
        this.mandatory = mandatory
        this.nullable = nullable
    }
}

class StringParam extends Param {
    type: String = 'СТРОКА'
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (typeof (value) === 'string') {
            if (this.mandatory && value.length === 0) {
                // console.log(` ${name} не прошел проверку - пустая строка`)
                console.log(`${this.name} не прошел проверку - пустая строка`)
                throw new Error(`${this.name} не прошел проверку - пустая строка`)
            } else {
                // (` ${name} прошел проверку`)
            }
        } else {
            // console.log(` ${name} не прошел проверку`)
            console.log(`${this.name} не прошел проверку`)
            throw new Error(`${this.name} не прошел проверку`)
        }
    }
}

class NumParam extends Param {
    type: String = 'ЧИСЛО'
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (!(typeof (value) === 'number')) throw new Error(`${this.name} не прошел проверку`)
    }
}

class BoolParam extends Param {
    type: String = 'ЛОГИЧЕСКИЙ'
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (!(typeof (value) === 'boolean')) throw new Error(`${this.name} не прошел проверку`)
    }
}

class ArrParam extends Param {
    type: String = 'МАССИВ'
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (!Array.isArray(value)) throw new Error(`${this.name} не прошел проверку`)
    }
}


class PhoneParam extends Param {
    type: String = 'ТЕЛЕФОН'
    constructor(name: string, description: string, mandatory: boolean, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (typeof (value) === 'string') {
            if (!checkPhone.test(value)) {
                throw new Error(`${this.name} не прошел проверку формата`)
            }
        } else {
            throw new Error(`${this.name} не прошел проверку`)
        }
    }
}

class ObjParam extends Param {
    type: string = 'ОБЪЕКТ'
    keys: Array<any>
    constructor(name: string, description: string, mandatory: boolean, keys: Array<any>, nullable: boolean = false) {
        super(name, description, mandatory, nullable)
        this.keys = keys
    }
    check(value: any) {
        if (this.nullable && value === null) return
        if (typeof (value) === 'object' && value !== null) {
            for (let i = 0; i < this.keys.length; i++) {
                let elem = this.keys[i]
                try {
                    if (typeof(value[elem.name]) !== 'undefined') elem.check(value[elem.name])
                    else {
                        if (elem.mandatory) throw new Error(`Обязательный параметр ${this.name}.${elem.name} отсутствует`)
                    }
                } catch (err) {
                    throw new Error(`${this.name}.${elem.name} не прошел проверку: ${err.message}`)
                }
            }
        } else {
            // console.log(` ${name} не прошел проверку`)
            console.log(` ${this.name} не прошел проверку`)
            throw new Error(` ${this.name} не прошел проверку`)
        }
    }
}



const methods: { [index: string]: any } = {

    '/registration/createLead': {
        parameters: [
            new ObjParam('form', 'Объект формы createLead', true, [
                new StringParam('firstName', 'Имя клиента', true),
                new StringParam('lastName', 'Фамилия клиента', true),
                new StringParam('middleName', 'Отчество клиента', true),
                new StringParam('email', 'Почта клиента', true),
                new PhoneParam('mobile', 'Мобильный телефон клиента', true)
            ])
        ]
    },

    '/registration/sendSmsCode': {
        parameters: [
            new PhoneParam('mobile', 'Мобильный телефон клиента', true),
            new StringParam('sessionId', 'Сессия клиента', true, true),
            new NumParam('step', 'Шаг формы', true)
        ]
    },

    '/registration/saveStep1': {
        parameters: [
            new ObjParam('form', 'Объект формы saveStep1', true, [
                new BoolParam('isIIS', 'Выбран ИИС?', true),
                new BoolParam('isEBS', 'Выбран ЕБС?', true),
                new ObjParam('selectedBoards', 'Объект формы saveStep1', true, []),
                new StringParam('birthday', 'Дата рождения Клиента', true),
                new StringParam('passportSeries', 'Серия паспорта', true),
                new StringParam('passportNumber', 'Номер паспорта', true),
                new StringParam('passportDate', 'Дата получения паспорта', true),
                new StringParam('passportOrgName', 'Кем выдан', true),
                new StringParam('passportBirthPlace', 'Место рождения', true),
                new StringParam('passportOrgCode', 'Код подразделения', true),
                new StringParam('inn', 'ИНН', true),
                new BoolParam('IISWarningApproved', 'Подтвержено предупреждение?', true),
                new StringParam('selectedFilial', 'Выбранный филиал', true),
                new NumParam('selectedFilialCode', 'Код филиала', true),
                new StringParam('addressOff', 'Адрес регистрации', true),
                new StringParam('addressPost', 'Почтовый адрес', true),
                new BoolParam('compliance', 'Принял соглашение?', true),
                new StringParam('fileScan1', 'Первый разворот паспорта BASE64', true),
                new StringParam('fileScan2', 'Второй разворот паспорта BASE64', true),
                new StringParam('smsCode', 'Смс код подтверждения', true)
            ]),
            new StringParam('sessionId', 'ID сессии', true)
        ]
    },

    '/registration/saveStep2': {
        parameters: [
            new ObjParam('form', 'Объект формы saveStep2', true, [
                new StringParam('selectedCurrency', 'Смс код подтверждения', true),
                new StringParam('bankBIK', 'БИК', true),
                new StringParam('bankName', 'Название эмитента', true),
                new StringParam('bankAccountNum', 'Номер счета', true),
                new StringParam('bankAccountHolder', 'Имя держателя', true),
                new StringParam('bankFileScan', 'Скан реквизитов BASE64', true),
                new StringParam('smsCode', 'Смс код подтверждения', true)
            ]),
            new StringParam('sessionId', 'ID сессии', true),
            new StringParam('pushServiceToken', 'FCM/HCM токен', true),
        ]
    }
}

const checkParameters = (req: any) => {
    const checkResult: CheckResult = {
        success: true,
        error: ''
    }

    const setError = (msg: string) => {
        checkResult.success = false
        checkResult.error = msg
    }

    try {
        if (req.originalUrl in methods) {
            for (let i = 0; i < methods[req.originalUrl].parameters.length; i++) {
                let element = methods[req.originalUrl].parameters[i]
                let name = element.name
                let value = req.body[name]
                if (typeof(value) !== 'undefined') element.check(value)
                else {
                    if (element.mandatory) throw new Error(`Обязательный параметр ${name} отсутствует`)
                }               
            }
        } else {
            throw new Error('Heизвестный метод')
        }
    } catch (err) {
        setError(err.message)
    } finally {
        return checkResult
    }
}

export default checkParameters
