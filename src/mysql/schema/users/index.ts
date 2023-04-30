import { Users } from '../../entities'
import { bcryptjsUtils } from '../../../core/utils'

export const usersTypeDefs = `#graphql
type User {
    id: String
    roles: String
    status: String
    email: String
    name: String
    country: String
    phone: String
    telegram: String
    created_at: String
    updated_at: String
}

type CreateUserResponse {
    id: String
    roles: String
    status: String
    created_at: String
    updated_at: String
}

type Query {
    getUser(id: ID!): User,
    getUserByEmail(email: String!): User
}

type Mutation {
    createUser(
        email: String!,
        password: String!,
        name: String!,
        country: String!,
        phone: String!,
        telegram: String!
    ): CreateUserResponse
}`

export const usersResolvers = {
    Query: {
        getUser: (parent, args) => {
            return Users.findOne({ where: { id: args.id } })
        },
        getUserByEmail: async (_root, { email }, context) => {
            const user = await Users.findOne({ where: { email } })
            return user
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            args.password = await bcryptjsUtils.encrypt(args.password)
            const user = await Users.insert(args)
            return user.generatedMaps[0]
        }
    }
}
