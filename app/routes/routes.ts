import { Router } from 'express'
import controllers from '../controller/controller'
import { checkParams } from '../middleware/middleware'

const router: Router = Router()

router.post('*', checkParams)
router.post('/createLead', (req, res) => controllers.createLead(req, res))
router.get('/load-initial-data', (req, res) => controllers.loadInitialData(req, res))

export default router