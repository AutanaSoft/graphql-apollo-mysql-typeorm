import bcrypt from 'bcryptjs'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Timestamp,
    UpdateDateColumn
} from 'typeorm'
import { UserToken, UsersRolesType, UsersStatusType } from '../../core/models'
import { token_utils } from '../../core/utils'
import { Profiles } from '@/mysql/entities/profiles.entity'

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: UsersRolesType, default: UsersRolesType.USER })
    roles: string

    @Column({ type: 'enum', enum: UsersStatusType, default: UsersStatusType.REGISTERED })
    status: string

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string

    @Column({ type: 'varchar', length: 100 })
    password: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Timestamp

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updated_at: Timestamp

    @Column({ type: 'uuid', nullable: true })
    profile_id: string

    @OneToOne(() => Profiles)
    @JoinColumn({ name: 'profile_id' })
    profile: Profiles

    hashPassword(password: string) {
        this.password = bcrypt.hashSync(password, 10)
    }

    isPasswordValid(password: string) {
        return bcrypt.compareSync(password, this.password)
    }

    generateToken() {
        const payload: UserToken = {
            id: this.id,
            email: this.email,
            roles: this.roles,
            status: this.status
        }
        return token_utils.generateToken(payload)
    }
}
