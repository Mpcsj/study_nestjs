import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor
    (    
        private authService:AuthService
    ){}
    @Post('/signup')
    signUp(@Body(ValidationPipe)authCredentials:AuthCredentialsDto):Promise<void>{
        console.log(authCredentials)
        return this.authService.signUp(authCredentials)
    }
}