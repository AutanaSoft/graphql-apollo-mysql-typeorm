import jwt from 'jsonwebtoken'
import { JWT_EXPIRES, JWT_SECRET } from '../environment'
import { TokenResponse, TokenType, UserToken } from '../models'
import { dateUtils } from '.'

export const generateToken = (user: UserToken): TokenResponse => {
    const payload = {
        user,
        create_at: dateUtils.now(),
        expired_at: dateUtils.setDate({ time: JWT_EXPIRES })
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    return {
        token,
        created_at: payload.create_at,
        expires_at: payload.expired_at
    }
}

export const decodedToken = (token: string): TokenType => {
    try {
        return jwt.verify(getToken(token), JWT_SECRET) as unknown as TokenType
    } catch (err) {
        return {
            user: null,
            message: err.message,
            create_at: dateUtils.now(),
            expires_at: dateUtils.now()
        } as unknown as TokenType
    }
}

export const getToken = (token: string | undefined): string =>
    token?.replace('Bearer ', '').trim() ?? 'TOKEN_NOT_FOUND'

export default { generateToken, decodedToken, getToken }
