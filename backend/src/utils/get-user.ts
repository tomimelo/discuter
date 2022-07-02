import { User } from '../types/user'
import { UserMetadata } from '../types/user-metadata'

export function getUser (userMetadata: UserMetadata): User {
  return {
    avatar_url: userMetadata.avatar_url,
    email: userMetadata.email,
    full_name: userMetadata.full_name,
    name: userMetadata.name,
    user_name: userMetadata.user_name
  }
}
