export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    email: string;
    nickname: string;
    avatarUrl: string;
    role: UserRole;
    cryptoWalletAddress: string;
    cryptoQrCodeUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
