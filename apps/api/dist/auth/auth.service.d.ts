import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            nickname: any;
            avatar_url: any;
            role: any;
        };
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            nickname: string;
            role: import("../users/entities/user.entity").UserRole;
        };
        access_token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        nickname: string;
        avatar_url: string;
        role: import("../users/entities/user.entity").UserRole;
        crypto_wallet_address: string;
        crypto_qr_code_url: string;
        created_at: Date;
        products: import("../products/entities/product.entity").Product[];
        orders_bought: import("../orders/entities/order.entity").Order[];
        orders_sold: import("../orders/entities/order.entity").Order[];
    }>;
}
