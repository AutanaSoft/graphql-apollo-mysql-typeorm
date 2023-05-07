export type UserToken = {
    id: string
    roles: string
    status: string
    email: string
}

export type TokenType = {
    user: UserToken | null
    message?: string
    create_at: string
    expires_at: string
}

export type TokenResponse = {
    token: string
    created_at: string
    expires_at: string
}
