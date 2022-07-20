import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { RoomController } from '../../room/room-controller'
import { authServiceAcquirer } from '../../utils/acquirers/auth-service-acquirer'
import { loggerAcquirer } from '../../utils/acquirers/logger-acquirer'
import { supabaseServiceAcquirer } from '../../utils/acquirers/supabase-service-acquirer'
import { twilioClientAcquirer } from '../../utils/acquirers/twilio-client-acquirer'
import verifyJWT from '../middlewares/verifyJwt'

const logger = loggerAcquirer.acquire().child('RoomController')

const supabaseService = supabaseServiceAcquirer.acquire()
const authService = authServiceAcquirer.acquire()
const twilioClient = twilioClientAcquirer.acquire()
const roomController = new RoomController(supabaseService, twilioClient, logger)

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
  handler: roomController.createLink
}

const updateLink: MadRoute = {
  method: MadRouteMethod.PUT,
  path: '/link/:uniqueName',
  middlewares: [verifyJWT(authService)],
  handler: roomController.updateLink
}

const deleteLink: MadRoute = {
  method: MadRouteMethod.DELETE,
  path: '/link/:uniqueName',
  middlewares: [verifyJWT(authService)],
  handler: roomController.deleteLink
}

const joinByLink: MadRoute = {
  method: MadRouteMethod.GET,
  path: '/join/:id',
  middlewares: [verifyJWT(authService)],
  handler: roomController.joinByLink
}

const roomRouter = new MadRouter({
  basePath: '/rooms',
  name: 'Rooms',
  handlers: [getLink, createLink, updateLink, deleteLink, joinByLink]
})

export default roomRouter
