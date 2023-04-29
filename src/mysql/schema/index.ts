import { usersResolvers, usersTypeDefs } from './users'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { AuthResolvers, AuthTypeDefs } from './auth'

export const typeDefs = [AuthTypeDefs, usersTypeDefs]
export const resolvers = [AuthResolvers, usersResolvers]

export const schema = makeExecutableSchema({ typeDefs, resolvers })
