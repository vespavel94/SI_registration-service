import express from 'express'
import cors from 'cors'
import router from './routes/routes'
import moment from 'moment'
import rabbit from './rabbit/rabbit'

// const rabbit = new Rabbit()
rabbit.start()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))  

app.use('/registration', router)

app.listen(3000, () => 
    console.log(`[${moment().format('DD-MM-YYYY_HH:mm:ss')}] SolidInvestor Registration Service started on port:3000 in mode: ${process.env.NODE_ENV}`))