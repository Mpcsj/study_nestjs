import {User} from './user.entity'
import * as bcrypt from 'bcrypt';

describe('User entity',()=>{
    let user:User;

    beforeEach(()=>{
        user = new User()
        user.salt = 'testSalt'
        user.password = 'testPassword'
        bcrypt.hash = jest.fn()
    })
    describe('validatePassword',()=>{

        it('returns true as password is valid',async()=>{
            bcrypt.hash.mockReturnValue('testPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const res = await user.validatePassword('123456')
            expect(bcrypt.hash).toHaveBeenCalledWith('123456','testSalt')
            expect(res).toEqual(true)
        })
        it('returns false as password is invalid',async()=>{
            bcrypt.hash.mockReturnValue('wrongPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const res = await user.validatePassword('1234567')
            expect(bcrypt.hash).toHaveBeenCalledWith('1234567','testSalt')
            expect(res).toEqual(false)
        })
    })
})