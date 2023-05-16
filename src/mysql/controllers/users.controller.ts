import { Profiles, Users } from '@/mysql/entities'
import { Repository } from 'typeorm'
import AppDataSource from '../AppDataSource'
import { setGraphQLError } from '../utils'

class usersController {
    static instance: usersController
    private userRepository: Repository<Users>
    private profilesRepository: Repository<Profiles>

    constructor() {
        if (usersController.instance) {
            return usersController.instance
        }
        this.userRepository = AppDataSource.getRepository(Users)
        this.profilesRepository = AppDataSource.getRepository(Profiles)
        usersController.instance = this
    }

    async isEmailAvailable(email: string): Promise<boolean> {
        return (await this.userRepository.findOneBy({ email })) ? true : false
    }

    async createUser(email: string, password: string) {
        const user = new Users()
        user.email = email
        user.hashPassword(password)
        await this.userRepository.insert(user)
        return user.generateToken()
    }

    async loginUser(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email })
        if (!user || !user.isPasswordValid(password))
            setGraphQLError('Invalid User or Password', 'INVALID_USER_OR_PASSWORD')
        return user.generateToken()
    }

    async getUsers() {
        return await this.userRepository.createQueryBuilder('user').getMany()
    }

    async getUserWithProfile(id: string) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .leftJoinAndSelect('user.profile', 'profile')
            .getOne()
    }

    async getUserById(id: string) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne()
    }

    async getUserByEmail(email: string) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne()
    }

    async updateUserProfile(userId: string, values: any) {
        const user: Users = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id: userId })
            .getOne()

        // if the user does not have a related profile, we create it.
        if (!user.profile_id) {
            const profile = await this.profilesRepository
                .createQueryBuilder()
                .insert()
                .into(Profiles)
                .values(values)
                .execute()

            await this.userRepository
                .createQueryBuilder()
                .update()
                .set({ profile_id: profile.identifiers[0].id })
                .where('id = :id', { id: userId })
                .execute()
        } else {
            // We update the profile data
            await this.profilesRepository
                .createQueryBuilder()
                .update()
                .set(values)
                .where('id = :id', { id: user.profile_id })
                .execute()
        }
        return await this.getUserWithProfile(userId)
    }
}

export const UsersController = new usersController()
