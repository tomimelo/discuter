import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { RoomController } from '../../room/room-controller'
import { SupabaseConfig } from '../../supabase/supabase-config'
import { SupabaseService } from '../../supabase/supabase-service'
import { authServiceAcquirer } from '../../utils/acquirers/auth-service-acquirer'
import { loggerAcquirer } from '../../utils/acquirers/logger-acquirer'
import verifyJWT from '../middlewares/verifyJwt'

const logger = loggerAcquirer.acquire().child('RoomController')
const supabaseConfig: SupabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE || ''
}

const authService = authServiceAcquirer.acquire()

const supabaseService = new SupabaseService(supabaseConfig)
const roomController = new RoomController(supabaseService, logger)

const getLink: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/link',
  middlewares: [verifyJWT(authService)],
  handler: roomController.getLink
}

const createLink: MadRoute = {
  method: MadRouteMethod.POST,
  path: '/link',
  middlewares: [verifyJWT(authService)],
  handler: roomController.getLink
}

const roomRouter = new MadRouter({
  basePath: '/rooms',
  name: 'Rooms',
  handlers: [getLink, createLink]
})

export default roomRouter
