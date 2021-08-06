import RabbitMQ from 'solid-communication-foundation'

const userName: string = process.env.USERNAME?.toUpperCase() || 'VESELOV'
const channelMQ: string = process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'dev'
    ? `${userName}_SI_RS` : 'SolidInvestorRegService'
const microserviceINT: string = process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'dev'
    ? `${userName}_ONECLICK_INT` : 'OneClickInt'

const rabbit = new RabbitMQ('./app/config/rabbit/', channelMQ, require('solid-logger')('scf', 'trade:rabbitmq', process.env.NODE_ENV !== 'debug'))

interface RabbitMethod {
    methodName: string,
    type: string,
    microservice: string
}

const methods: { [key: string]: RabbitMethod } = {
    'createLead': {
        methodName: 'createLead',
        type: '',
        microservice: microserviceINT
    },

    'getFilialsList': {
        methodName: 'getFilialList',
        type: '',
        microservice: microserviceINT
    },

    'getStrategiesList': {
        methodName: 'getStrategiesList',
        type: '',
        microservice: microserviceINT
    },

    'sendSmsCode': {
        methodName: 'sendSmsCode',
        type: '',
        microservice: microserviceINT
    },

    'saveStep1': {
        methodName: 'saveStep1',
        type: '',
        microservice: microserviceINT
    },

    'saveStep2': {
        methodName: 'saveStep2',
        type: '',
        microservice: microserviceINT
    }
}

const start = () => {
    rabbit.start()
}

const sendRequest = (method: string, params: object) => {
    const param = {
        '$type': `MessageDataTypes.${methods[method].type}, MessageDataTypes`,
        ...params
    }
    return rabbit.sendRequest(methods[method].microservice, methods[method].methodName, param)
}

const sendRequestPromised = async (method: string, params: object) => {
    const param = {
        '$type': `MessageDataTypes.${methods[method].type}, MessageDataTypes`,
        ...params
    }

    try {
        const response = (await rabbit.sendRequestPromised(methods[method].microservice, methods[method].methodName, param, null, 10000, '')).response.Data
        if (response.status === 'error') throw new Error(response.message)
        return response
    } catch (err) {
        throw new Error(`Rabbit error: ${err.message}`)
    }
}

export default { 
    start,
    sendRequest,
    sendRequestPromised
}
