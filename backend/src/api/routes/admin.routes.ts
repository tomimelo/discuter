import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { AdminController } from '../../admin/admin-controller'
import { authServiceAcquirer } from '../../utils/acquirers/auth-service-acquirer'
import { loggerAcquirer } from '../../utils/acquirers/logger-acquirer'
import { supabaseServiceAcquirer } from '../../utils/acquirers/supabase-service-acquirer'
import { twilioClientAcquirer } from '../../utils/acquirers/twilio-client-acquirer'
import isAdmin from '../middlewares/isAdmin'
import verifyJWT from '../middlewares/verifyJwt'

const authService = authServiceAcquirer.acquire()
const supabaseService = supabaseServiceAcquirer.acquire()
const twilioClient = twilioClientAcquirer.acquire()
const logger = loggerAcquirer.acquire().child('AdminController')

const adminController = new AdminController(supabaseService, twilioClient, logger)

const wipeout: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/wipeout',
  middlewares: [verifyJWT(authService), isAdmin()],
  handler: adminController.wipeout
}

const router = new MadRouter({ basePath: '/admin', name: 'Admin', handlers: [wipeout] })

export default router
