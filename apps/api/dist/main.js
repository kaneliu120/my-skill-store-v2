"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((req, res, next) => {
        const allowedOrigins = [
            'https://myskillstore-web.onrender.com',
            'https://myskillshop-web.onrender.com',
            'https://skills-store-api-bjbddhaeathndkap.southeastasia-01.azurewebsites.net',
            'http://localhost:3000',
        ];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
        }
        else {
            next();
        }
    });
    app.enableCors({
        origin: [
            'https://myskillstore-web.onrender.com',
            'https://myskillshop-web.onrender.com',
            'http://localhost:3000',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 8080);
    console.log(`API running on port ${process.env.PORT ?? 8080}`);
}
bootstrap();
//# sourceMappingURL=main.js.map