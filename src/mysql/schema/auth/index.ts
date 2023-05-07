import { CreateUserResolvers, CreateUserTypeDefs } from './CreateUser'
import { LoginUserResolvers, LoginUserTypeDefs } from './LoginUser'

export const AuthTypeDefs = [CreateUserTypeDefs, LoginUserTypeDefs]
export const AuthResolvers = [CreateUserResolvers, LoginUserResolvers]
