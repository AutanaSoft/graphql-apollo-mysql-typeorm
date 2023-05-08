import { makeExecutableSchema } from '@graphql-tools/schema'
import { PubSub } from 'graphql-subscriptions'
import { AuthResolvers, AuthTypeDefs } from './auth'
import { UsersResolvers, UsersTypeDefs } from './users'
import { SubsResolvers, SubsTypeDefs } from './testSubscription'

const typeDefs = [...AuthTypeDefs, ...UsersTypeDefs, SubsTypeDefs]
const resolvers = [...AuthResolvers, ...UsersResolvers, SubsResolvers]

export const pubsub = new PubSub()
export const schema = makeExecutableSchema({ typeDefs, resolvers })
