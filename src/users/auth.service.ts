import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";

const script = promisify(_script);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException("e-mail already in use");
        }

        const salt = randomBytes(8).toString('hex');
        
        const hash = (await script(password, salt, 32)) as Buffer;

        const result = `${salt}.${hash.toString('hex')}`; 

        const user = this.usersService.create(email, result)

        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if(!user) {
            throw new NotFoundException("User not found")
        }

        const [salt, storedHash] = user.password.split(".");

        const hash = (await script(password, salt, 32)) as Buffer;

        if(hash.toString('hex') !== storedHash) {
            throw new BadRequestException("Passwords don't match")
        }
        return user;
    }
}