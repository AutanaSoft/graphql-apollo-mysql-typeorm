import { Users } from '../../entities'
import { connectToMysql } from '../../index'
import { bcryptjsUtils, jwtUtils } from '../../../core/utils'
import { GraphQLError } from 'graphql/error'

export const AuthTypeDefs = `#graphql
type Auth {
    token: String
    created_at: String
    expires_at: String
}

type Query {
    userLogin(email: String!, password: String!): Auth
}
`
export const AuthResolvers = {
    Query: {
        userLogin: async (parent, { email, password }) => {
            const query = await connectToMysql
                .getRepository(Users)
                .createQueryBuilder('user')
                .where('user.email = :email', { email })
                .getOne()

            const isPasswordValid = await bcryptjsUtils.compare(password, query.password)

            if (!isPasswordValid) {
                throw new GraphQLError('Invalid User or Password', {
                    extensions: {
                        code: 'INVALID_USER_OR_PASSWORD'
                    }
                })
            }
            const { id, roles, status } = query
            return jwtUtils.generateToken({ id, roles, status, email })
        }
    }
}
