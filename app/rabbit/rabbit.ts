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
        methodName: 'kek',
        type: '',
        microservice: microserviceINT
    },

    'getFilialsList': {
        methodName: 'getFilialList',
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

const sendRequestPromised = (method: string, params: object) => {
    const param = {
        '$type': `MessageDataTypes.${methods[method].type}, MessageDataTypes`,
        ...params
    }

    return rabbit.sendRequestPromised(methods[method].microservice, methods[method].methodName, param, null, 10000, '')
   
    // return new Promise((resolve, reject) => {
    //     let param = {
    //         '$type': `MessageDataTypes.${methods[method].type}, MessageDataTypes`,
    //         ...params
    //     }
    //     rabbit.sendRequestPromised(methods[method].microservice, methods[method].methodName, param, null, 10000, '')
    //         .then((response: any) => {
    //             if (response.response) {
    //                 resolve(response.response.Data)
    //             } else {
    //                 reject(new Error('No data recieved'))
    //             }
    //         })
    //         .catch((err: any) => {
    //             reject(new Error(err))
    //         })
    // })
}

export default { 
    start,
    sendRequest,
    sendRequestPromised
}
