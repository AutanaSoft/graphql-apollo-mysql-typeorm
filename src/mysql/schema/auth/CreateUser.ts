import { TokenResponse } from '../../../core/models'
import { UsersController } from '../../controllers'

export const CreateUserTypeDefs = `#graphql

type TokenResponse {
    token: String!
    created_at: String!
    expires_at: String!
}

type Query {
   CheckIfEmailRegistered (email: ID!): Boolean
}

type Mutation {
    CreateUser(password: String!, email: String!): TokenResponse
}`

export const CreateUserResolvers = {
    Query: {
        CheckIfEmailRegistered: async (parent, { email }): Promise<boolean> => {
            return UsersController.isEmailAvailable(email)
        }
    },

    Mutation: {
        CreateUser: async (parent, { email, password }): Promise<TokenResponse> => {
            return UsersController.createUser(email, password)
        }
    }
}
