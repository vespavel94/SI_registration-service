const checkPhone = /^\(9[0-9]{2}\) [0-9]{3}-[0-9]{4}$/

interface CheckResult {
    success: boolean,
    error: string
}

class Param {
    name: string
    description: string
    mandatory: boolean
    constructor(name: string, description: string, mandatory: boolean) {
        this.name = name
        this.description = description
        this.mandatory = mandatory
    }
}

class StringParam extends Param {
    type: String = 'СТРОКА'
    constructor(name: string, description: string, mandatory: boolean) {
        super(name, description, mandatory)
    }
    check(value: any) {
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
    constructor(name: string, description: string, mandatory: boolean) {
        super(name, description, mandatory)
    }
    check(value: any) {
        if (!(typeof (value) === 'number')) throw new Error(`${this.name} не прошел проверку`)
    }
}

class BoolParam extends Param {
    type: String = 'ЛОГИЧЕСКИЙ'
    constructor(name: string, description: string, mandatory: boolean) {
        super(name, description, mandatory)
    }
    check(value: any) {
        if (!(typeof (value) === 'boolean')) throw new Error(`${this.name} не прошел проверку`)
    }
}

class ArrParam extends Param {
    type: String = 'МАССИВ'
    constructor(name: string, description: string, mandatory: boolean) {
        super(name, description, mandatory)
    }
    check(value: any) {
        if (!Array.isArray(value)) throw new Error(`${this.name} не прошел проверку`)
    }
}


class PhoneParam extends Param {
    type: String = 'ТЕЛЕФОН'
    constructor(name: string, description: string, mandatory: boolean) {
        super(name, description, mandatory)
    }
    check(value: any) {
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
    constructor(name: string, description: string, mandatory: boolean, keys: Array<any>) {
        super(name, description, mandatory)
        this.keys = keys
    }
    check(value: any) {
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
                new PhoneParam('mobile', 'Мобильный телефон клиента', true),
            ])
        ]
    },

    '/registration/sendSmsCode': {
        parameters: [
            new PhoneParam('mobile', 'Мобильный телефон клиента', true),
            new StringParam('sessionId', 'Сессия клиента', true),
            new NumParam('step', 'Шаг формы', true)
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
