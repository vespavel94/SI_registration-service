import { Router } from 'express'
import controllers from '../controller/controller'

const router: Router = Router()

router.post('/first', (req, res) => controllers.firstStep(req, res))

export default router