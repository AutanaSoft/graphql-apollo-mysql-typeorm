import jwt from 'jsonwebtoken'
import { JWT_EXPIRES, JWT_SECRET } from '../globals'

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return {
        user: null,
        message: err.message,
        exp: new Date('1979-04-21T00:00:00Z').getTime() / 1000
      }
    }
    return decoded
  })
}
