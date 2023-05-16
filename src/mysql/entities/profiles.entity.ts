import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    Timestamp,
    UpdateDateColumn
} from 'typeorm'
import { Users } from '@/mysql/entities/users.entity'

@Entity()
export class Profiles {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 20, nullable: true })
    first_name: string

    @Column({ type: 'varchar', length: 20, nullable: true })
    last_name: string

    @Column({ type: 'varchar', length: 50, nullable: true })
    country: string

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string

    @Column({ type: 'varchar', length: 20, nullable: true })
    telegram: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Timestamp

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updated_at: Timestamp

    @OneToOne(() => Users, (user) => user.profile)
    user: Users
}
