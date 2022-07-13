import { AuthConfig } from '../../auth/auth-config'
import { AuthService } from '../../auth/auth-service'
import { Acquirer } from './acquirer'

class AuthServiceAcquirer implements Acquirer<AuthService> {
  private authService: AuthService
  public constructor (config: AuthConfig) {
    this.authService = new AuthService(config)
  }

  public acquire (): AuthService {
    return this.authService
  }
}

const authConfig: AuthConfig = {
  secret: process.env.SUPABASE_JWT_SECRET || ''
}

export const authServiceAcquirer = new AuthServiceAcquirer(authConfig)
