import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    // @Get('whoami')
    // whoAmI(@Session() session:any) {
    //     return this.usersService.findOne(session.userId)
    // }

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session:any) {
        session.userId = null;
    }
    
    @Post('/signup')
    async signUp(
        @Body() body: CreateUserDto,
        @Session() session: any
    ) {
        const user = await this.authService.signup(body.email, body.password)

        session.userId = user.id;

        return user;
    }

    @Post('/signin')
    async signIn(
        @Body() body: CreateUserDto,
        @Session() session: any
    ) {

        const user = await this.authService.signin(body.email, body.password)
        
        session.userId = user.id;

        return user;
    }
    
    @Get(':id') 
    async findUser(@Param("id") id: string) {
        console.log("handler running")
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException("User not found");
        }
        return user
    }

    @Get() 
    findAllUsers(@Query("email") email: string) {
        return this.usersService.find(email);
    }

    @Delete('id')
    removeUser(@Param("id") id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Patch(':id')
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }

}
