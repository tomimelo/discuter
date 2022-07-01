import config from 'config'
import { MadRouter } from 'mad-server'
import { AppConfig } from '../../config'
import exampleRouter from './example.routes'

const apiVersion = config.get<AppConfig['api']>('api').version

const router = new MadRouter({ basePath: `/api/v${apiVersion}`, handlers: [exampleRouter] })

export default router
