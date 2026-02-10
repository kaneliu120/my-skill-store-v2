import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private s3;
    private bucket;
    private endpoint;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        key: string;
        url: string;
    }>;
    getFileUrl(key: string): string;
    private generateId;
}
