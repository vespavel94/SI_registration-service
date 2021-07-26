import express from 'express'
import cors from 'cors'
import router from './routes/routes'
import moment from 'moment'

const app: express.Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))  

app.use('/', router)

app.listen(3000, () => console.log(`[${moment().format('DD-MM-YYYY_HH:mm:ss')}] SolidInvestor Registration Service started on port:3000`))