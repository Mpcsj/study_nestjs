import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwtpayload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger()
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService:JwtService
    ){}
    async signUp(authCredentials:AuthCredentialsDto){
        return this.userRepository.signUp(authCredentials)       
    }

    async signIn(credentials:AuthCredentialsDto):Promise<{accessToken:string}>{
        const result = await this.userRepository.validateUserPassword(credentials)
        if(!result){
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload:JwtPayload = {username:result}
        const accessToken = await this.jwtService.sign(payload)
        this.logger.debug(`Token jwt gerado com payload:${JSON.stringify(payload)}`)
        return{accessToken}
    }
}
