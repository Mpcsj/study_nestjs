import { Test } from "@nestjs/testing";
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
const TAG = 'user.repository'
const mockCredentialsDto ={
    username:'TestUserName',
    password:'TestPassword'
}
describe('UserRepository',()=>{
    // let userRepository:UserRepository;
    let userRepository;
    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                UserRepository
            ]
        }).compile()
        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('signUp',()=>{
        let save;
        beforeEach(()=>{
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({save})
        })
        it('successfully signs up the user',async()=>{
            save.mockResolvedValue(undefined)
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
        })

        it('throws a conflict exception as username already exists',async()=>{
            save.mockRejectedValue({code:'23505'})
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException)
        })
        it('throws a generic internal server error exception',async()=>{
            save.mockRejectedValue({code:123123}) // unhandled error code
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('validateUserPassword', () => {
        let user
        const username ='Testusername'
        beforeEach(()=>{
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = username
            user.validatePassword = jest.fn()
        })

        it('returns the username as validation is sucessfull',async()=>{
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)
            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(result).toEqual(username)
        })
        it('returns null as user cannot be found',async()=>{
            userRepository.findOne.mockResolvedValue(null)
            const res = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(res).toBeNull()
        })
        it('returns null as password be valid',async()=>{
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)
            const res = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).toHaveBeenCalled()
            expect(res).toBeNull()
        })

    })
    describe('hashPassword',()=>{
        it('calls bcrypt.hash to generate a hash',async()=>{
            const testHash = 'testHash'
            const testSalt ='testSalt'
            const testPassword = 'testPassword'
            bcrypt.hash = jest.fn().mockResolvedValue(testHash)
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await userRepository.hashPassword(testPassword,testSalt)
            expect(bcrypt.hash).toHaveBeenCalledWith(testPassword,testSalt)
            expect(result).toEqual(testHash)
        })
    })
})