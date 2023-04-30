import jwt from 'jsonwebtoken'
import { JWT_EXPIRES, JWT_SECRET } from '../environment'
import { TokenResponse, TokenType, UserToken } from '../models'
import { dateUtils } from '../utils'

/**
 * @param user Object with user data to generate token
 * @returns Object with token data response
 */
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

/**
 * @param token String with token to verify
 * @returns Object with token data
 */
export const verifyToken = (token: string): TokenType => {
    try {
        return jwt.verify(token, JWT_SECRET) as unknown as TokenType
    } catch (err) {
        return {
            user: null,
            message: err.message,
            create_at: dateUtils.now(),
            expired_at: dateUtils.now()
        } as unknown as TokenType
    }
}
