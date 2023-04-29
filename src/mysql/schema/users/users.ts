import { Timestamp } from 'typeorm'

export type User = {
  id: string
  roles: string
  status: string
  email: string
  name: string
  country: string
  phone: string
  telegram: string
  password: string
  created_at: Timestamp
  updated_at: Timestamp
}

export type UserLogin = {
  token?: string
  created_at: Timestamp
  expires_at: Timestamp
  updated_at: Timestamp
}

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
    password: String
    created_at: String
    updated_at: String
}

type UserLogin {
    token: String
    created_at: String
    expires_at: String
    updated_at: String
}`
