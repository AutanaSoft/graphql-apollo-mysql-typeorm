import { Users } from '../../entities'
import { connectToMysql } from '../../index'
import { encrypt, authUtil } from '../../../util'
import { GraphQLError } from 'graphql/error'

export const AuthTypeDefs = `#graphql
type Auth {
    token: String
    createdAt: String
    expiresAt: String
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

      const isPasswordValid = await encrypt.compare(password, query.password)

      if (!isPasswordValid) {
        throw new GraphQLError('Invalid User or Password', {
          extensions: {
            code: 'INVALID_USER_OR_PASSWORD'
          }
        })
      }
      const { id, roles, status } = query
      const token = authUtil.generateToken({ user: { id, roles, status, email } })
      const { iat: createdAt, exp: expiresAt } = authUtil.verifyToken(token)
      return {
        token,
        createdAt,
        expiresAt
      }
    }
  }
}
