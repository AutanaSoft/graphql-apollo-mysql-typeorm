import { makeExecutableSchema } from '@graphql-tools/schema'
import { PubSub } from 'graphql-subscriptions'
import { AuthResolvers, AuthTypeDefs } from './auth'
import { UsersResolvers, UsersTypeDefs } from './users'

export const pubsub = new PubSub()
export const typeDefs = [...AuthTypeDefs, ...UsersTypeDefs]
export const resolvers = [...AuthResolvers, ...UsersResolvers]

export const schema = makeExecutableSchema({ typeDefs, resolvers })
