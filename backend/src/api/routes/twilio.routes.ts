import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { TwilioConfig } from '../../twilio/twilio-config'
import { TwilioFactory } from '../../twilio/twilio-factory'
import { authServiceAcquirer } from '../../utils/acquirers/auth-service-acquirer'
import verifyJWT from '../middlewares/verifyJwt'

const twilioConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  apiKey: process.env.TWILIO_API_KEY || '',
  apiSecret: process.env.TWILIO_API_SECRET || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  serviceSid: process.env.TWILIO_SERVICE_SID || ''
}
const twilioFactory = new TwilioFactory(twilioConfig)
const twilioController = twilioFactory.getController()

const authService = authServiceAcquirer.acquire()

const getAccessToken: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/access-token',
  middlewares: [verifyJWT(authService)],
  handler: twilioController.getAccessToken
}

const getRooms: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/rooms',
  middlewares: [verifyJWT(authService)],
  handler: twilioController.getRooms
}

const twilioRouter = new MadRouter({
  basePath: '/twilio',
  name: 'Twilio',
  handlers: [getAccessToken, getRooms]
})

export default twilioRouter
