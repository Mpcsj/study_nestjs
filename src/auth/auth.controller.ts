import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
const TAG = 'auth.controller'
@Controller('auth')
export class AuthController {
    constructor(    
        private authService:AuthService
    ){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentials:AuthCredentialsDto):Promise<void>{
        console.log(authCredentials)
        return this.authService.signUp(authCredentials)
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) authCredentials:AuthCredentialsDto):Promise<{accessToken:string}>{
        return this.authService.signIn(authCredentials)
    }

    @Post('/test')
    @UseGuards(AuthGuard()) // protegendo uma rota especifica para precisar to token
    test(@GetUser()user){
        console.log(TAG,'::user:',user)
    }
}
