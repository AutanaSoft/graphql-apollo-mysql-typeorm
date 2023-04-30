import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Timestamp,
    UpdateDateColumn
} from 'typeorm'

export enum UserRoles {
    USER = 'user',
    ADMIN = 'admin'
}

export enum UserStatus {
    REGISTERED = 'registered',
    ACTIVE = 'active',
    PAYMENT = 'payment',
    SUSPEND = 'suspend'
}

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
    roles: string
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.REGISTERED })
    status: string
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string
    @Column({ type: 'varchar', length: 100 })
    name: string
    @Column({ type: 'varchar', length: 50 })
    country: string
    @Column({ type: 'varchar', length: 50 })
    phone: string
    @Column({ type: 'varchar', length: 50 })
    telegram: string
    @Column({
        type: 'varchar',
        length: 255
    })
    password: string
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Timestamp
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Timestamp
}
