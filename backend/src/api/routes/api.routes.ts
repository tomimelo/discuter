import config from 'config'
import { MadRouter } from 'mad-server'
import { AppConfig } from '../../config'

const apiVersion = config.get<AppConfig['api']>('api').version

const router = new MadRouter({ basePath: `/api/v${apiVersion}`, handlers: [] })

export default router
