import { Repository, EntityRepository, WriteError } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
const TAG = 'user.repository'
@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signUp(authCredentials:AuthCredentialsDto):Promise<void>{
        try {
            const {username,password} = authCredentials
            const user = new User()
            user.username = username
            user.salt = await bcrypt.genSalt()
            user.password = await this.hashPassword(password,user.salt)
            console.log(TAG,'::user password:',user.password)
            await user.save()   
        } catch (error) {
            console.log(TAG,'::code:',error.code)
            if(error.code == 23505){
                throw new ConflictException('user already exists')
            }else{
                // console.log(TAG,'::erro:',JSON.stringify(error))
                throw new InternalServerErrorException(error['message'])
            }
        }
    }

    async validateUserPassword(credentials:AuthCredentialsDto):Promise<string>{
        const {username,password} = credentials
        const user = await this.findOne({username})
        if(user && await user.validatePassword(password)){
            return user.username
        }else{
            return null
        }
    }
    private async hashPassword(password:string,salt:string):Promise<string>{
        return bcrypt.hash(password,salt)
    }
}