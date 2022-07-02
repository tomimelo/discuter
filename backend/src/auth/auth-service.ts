import jwt from 'jsonwebtoken'
import { UserMetadata } from '../types/user-metadata'
import { AuthConfig } from './auth-config'

export class AuthService {
  public constructor (private readonly config: AuthConfig) {}

  public verifyJWT (token: string): Promise<UserMetadata> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.config.secret, (err, decoded: any) => {
        if (err) {
          return reject(new Error('Invalid token'))
        }
        const userMetadata = decoded?.user_metadata as UserMetadata
        if (!userMetadata) {
          return reject(new Error('Invalid token'))
        }
        resolve(userMetadata)
      })
    })
  }
}
