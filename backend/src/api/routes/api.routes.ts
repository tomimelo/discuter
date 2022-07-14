import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import exceptionHandler from '../middlewares/exceptionHandler'
import roomRouter from './room.routes'
import twilioRouter from './twilio.routes'
import adminRouter from './admin.routes'

const notFound: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/*',
  middlewares: [],
  handler: exceptionHandler.notFound
}

const apiRouter = new MadRouter({ basePath: '/api', handlers: [twilioRouter, roomRouter, notFound] })
const baseRouter = new MadRouter({ basePath: '', handlers: [apiRouter, adminRouter] })

export default baseRouter
