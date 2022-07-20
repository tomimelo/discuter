import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { TwilioFactory } from '../../twilio/twilio-factory'
import { authServiceAcquirer } from '../../utils/acquirers/auth-service-acquirer'
import verifyJWT from '../middlewares/verifyJwt'

const twilioController = new TwilioFactory().getController()

const authService = authServiceAcquirer.acquire()

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

export default twilioRouter
