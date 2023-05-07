export enum UsersStatusType {
    REGISTERED = 'registered',
    ACTIVE = 'active',
    PAYMENT = 'payment',
    SUSPEND = 'suspend'
}

export enum UsersRolesType {
    ANONYMOUS = 'anonymous',
    USER = 'user',
    ADMIN = 'admin'
}

export type UsersTypes = {
    id: string
    status: UsersStatusType
    roles: UsersRolesType
    email: string
    password: string
    created_at: Date
    updated_at: Date
    profile_id: string
}

export type UserTypes = {
    id: string
    user_id: string
    first_name: string
    last_name: string
    country: string
    phone: string
    telegram: string
    created_at: Date
    updated_at: Date
}
