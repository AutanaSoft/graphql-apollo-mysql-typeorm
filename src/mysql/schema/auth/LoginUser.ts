import { TokenResponse } from '../../../core/models'
import { UsersController } from '../../controllers'

export const LoginUserTypeDefs = `#graphql
extend  type Query {
    LoginUser(email: String!, password: String!): TokenResponse
}
`
export const LoginUserResolvers = {
    Query: {
        LoginUser: async (parent, { email, password }): Promise<TokenResponse> => {
            return UsersController.loginUser(email, password)
        }
    }
}
