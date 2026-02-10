import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            nickname: string;
            role: import("../users/entities/user.entity").UserRole;
        };
        access_token: string;
    }>;
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
    getProfile(req: Request & {
        user: any;
    }): Promise<{
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
