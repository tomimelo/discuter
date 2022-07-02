import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { AuthConfig } from '../../auth/auth-config'
import { AuthService } from '../../auth/auth-service'
import { TwilioConfig } from '../../twilio/twilio-config'
import { TwilioFactory } from '../../twilio/twilio-factory'
import verifyJWT from '../middlewares/verifyJwt'

const twilioConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  apiKey: process.env.TWILIO_API_KEY || '',
  apiSecret: process.env.TWILIO_API_SECRET || '',
  serviceSid: process.env.TWILIO_SERVICE_SID || ''
}
const twilioFactory = new TwilioFactory(twilioConfig)
const twilioController = twilioFactory.getController()

const authConfig: AuthConfig = {
  secret: process.env.SUPABASE_JWT_SECRET || ''
}
const authService = new AuthService(authConfig)

const getAccessToken: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/access-token',
  middlewares: [verifyJWT(authService)],
  handler: twilioController.getAccessToken
}

const twilioRouter = new MadRouter({
  basePath: '/twilio',
  name: 'Twilio',
  handlers: [getAccessToken]
})

const router = new MadRouter({ basePath: '/api', handlers: [twilioRouter] })

export default router
