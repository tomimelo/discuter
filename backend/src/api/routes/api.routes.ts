import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import exceptionHandler from '../middlewares/exceptionHandler'
import twilioRouter from './twilio.routes'

const notFound: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/*',
  middlewares: [],
  handler: exceptionHandler.notFound
}

const router = new MadRouter({ basePath: '/api', handlers: [twilioRouter, notFound] })

export default router
