import { JwtStrategy } from './jwt.strategy';
import {Test} from '@nestjs/testing'
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository =()=>({
    findOne:jest.fn()
})
describe('JwtStrategy',()=>{
    let jwtStrategy:JwtStrategy;
    let userRepository;

    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            providers:[
                JwtStrategy,
                {provide:UserRepository,useFactory:mockUserRepository}
            ]
        }).compile()
        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('validate',()=>{
        it('returns the user based on jwt payload',async()=>{
            const user  = new User()
            user.username = 'Test user'
            userRepository.findOne.mockResolvedValue(user)
            let res = await jwtStrategy.validate({username:'Test user'})
            expect(userRepository.findOne).toHaveBeenCalledWith({username:'Test user'})
            expect(res).toEqual(user)
        })
        it('throws an unauthorized exception as user was not found',async()=>{
            userRepository.findOne.mockResolvedValue(null)
            expect(jwtStrategy.validate({username:'Test user'})).rejects.toThrow(UnauthorizedException)
        })
    })
})