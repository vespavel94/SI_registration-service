import { Router } from 'express'
import controllers from '../controller/controller'
import { checkParams } from '../middleware/middleware'

const router: Router = Router()

router.post('*', checkParams)

router.post('/createLead', (req, res) => controllers.createLead(req, res))
router.get('/loadInitialData', (req, res) => controllers.loadInitialData(req, res))
router.post('/sendSmsCode', (req, res) => controllers.sendSmsCode(req, res))

export default router