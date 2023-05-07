import { UsersRolesType } from '../../../core/models'
import { UsersController } from '../../controllers'
import { setGraphQLError } from '../../utils'

export const GetUserTypeDefs = `#graphql
type User {
    id: ID!
    status: String!
    roles: String!
    email: String!
    profile_id: String
    created_at: String!
    updated_at: String!
}

type UserProfile {
    id: String!
    first_name: String!
    last_name: String!
    country: String!
    phone: String!
    telegram: String!
    created_at: String!
    updated_at: String!
}

type UserWithProfile {
    id: ID!
    status: String!
    roles: String!
    email: String!
    profile: UserProfile
    created_at: String!
    updated_at: String!
}

extend type Query {
    Me(id: ID): UserWithProfile
    GetUsers(limit: Int, offset: Int): [User]!
    GetUserById(id: ID!): User
    GetUserByEmail(email: String!): User
}

extend type Mutation{
    UpdateUserProfile(first_name: String!, last_name: String!, country: String!, phone: String!, telegram: String!): UserWithProfile
}`

export const GetUserResolvers = {
    Query: {
        Me: async (parent, args, context) => {
            return await UsersController.getUserWithProfile(context.user.id)
        },
        GetUsers: async (parent, args, context) => {
            //The user can only consult his own data
            if (context.user.roles !== UsersRolesType.ADMIN) {
                setGraphQLError(
                    'You do not have permissions to perform this action',
                    'forbidden',
                    403
                )
            }
            return await UsersController.getUsers()
        },
        GetUserById: async (parent, { id }, context) => {
            //The user can only consult his own data
            if (context.user.roles !== UsersRolesType.ADMIN && context.user.id !== id) {
                setGraphQLError(
                    'You do not have permissions to perform this action',
                    'forbidden',
                    403
                )
            }
            return await UsersController.getUserById(id)
        },
        GetUserByEmail: async (parent, { email }, context) => {
            //The user can only consult his own data
            if (context.user.roles !== UsersRolesType.ADMIN && context.user.email !== email) {
                setGraphQLError(
                    'You do not have permissions to perform this action',
                    'forbidden',
                    403
                )
            }
            return await UsersController.getUserByEmail(email)
        }
    },
    Mutation: {
        UpdateUserProfile: async (parent, args, context) => {
            return await UsersController.updateUserProfile(context.user.id, args)
        }
    }
}
