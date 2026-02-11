# MySkillStore v2.0

C2C AI 技能交易平台，支持加密货币支付与自动化交付。

## 核心功能

- **C2C 交易**：连接技能开发者（卖家）与用户（买家）
- **加密支付**：链下加密货币支付流程（平台不托管资金），支持 Ethereum、BSC、Polygon、Solana、Bitcoin
- **交付模式**：
  - **自动托管**：卖家确认后系统自动交付文件
  - **手动交付**：卖家通过聊天/Telegram 手动交付
- **审核系统**：所有商品上架需管理员审核通过
- **退款流程**：完整退款生命周期（申请 -> 审核 -> 批准/拒绝 -> 完成）
- **评价系统**：买家可对已完成订单评分评价（每订单限一次）
- **博客系统**：管理员管理的博客，支持 slug 路由
- **通知系统**：覆盖所有业务事件的站内通知
- **国际化**：通过 next-intl 支持 19+ 种语言
- **行为追踪**：前端事件追踪与数据分析

## 项目架构

```
my-skill-store-v2/
├── apps/
│   ├── api/            # NestJS 后端 API (TypeScript)
│   │   └── src/
│   │       ├── auth/           # JWT 认证 (Passport)
│   │       ├── users/          # 用户管理
│   │       ├── products/       # 商品/技能 CRUD + 管理员审核
│   │       ├── orders/         # 订单生命周期 & 状态机
│   │       ├── payments/       # 加密货币支付验证
│   │       ├── upload/         # S3 兼容文件上传 (MinIO/R2)
│   │       ├── blog/           # 博客系统
│   │       ├── reviews/        # 评分评价系统
│   │       ├── refunds/        # 退款流程
│   │       ├── tracking/       # 行为追踪 & 数据分析
│   │       ├── notifications/  # 站内通知系统
│   │       └── common/         # 公共过滤器 & 工具
│   └── web/            # Next.js 14 前端 (App Router)
│       └── src/
│           ├── app/[locale]/    # 页面 (19+ 种语言)
│           ├── components/      # React 组件
│           ├── lib/             # API 客户端 & 工具库
│           └── i18n/            # 国际化配置
├── docker-compose.yml           # 本地开发：PostgreSQL + MinIO
├── api.Dockerfile               # API 生产构建
├── web.Dockerfile               # Web 生产构建
├── render.yaml                  # Render.com 部署配置
└── .github/workflows/           # CI/CD (GitHub Actions + Azure)
```

### 技术栈

| 层级     | 技术                                |
| -------- | ----------------------------------- |
| 前端     | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui |
| 后端     | NestJS + TypeORM + Passport JWT     |
| 数据库   | PostgreSQL 15                       |
| 对象存储 | S3 兼容 (MinIO / Cloudflare R2)     |
| CI/CD    | GitHub Actions -> Azure 容器注册表  |
| 部署     | Azure Web App / Render.com          |

## 交易流程

```
买家浏览商品
  -> 下单 (CREATED)
    -> 报告支付 (PAID_REPORTED)
      -> 链上验证 (PAYMENT_VERIFIED)
        -> 卖家确认 (CONFIRMED)
          -> 交付完成 (COMPLETED)
          -> 或申请退款 (REFUND_REQUESTED -> REFUNDED)
```

**支持链**：Ethereum、BSC、Polygon、Solana、Bitcoin

## 订单状态机

| 状态               | 说明                   | 触发方    |
| ------------------ | ---------------------- | --------- |
| `CREATED`          | 已下单，等待支付       | 买家      |
| `PAID_REPORTED`    | 买家已报告加密支付     | 买家      |
| `PAYMENT_VERIFIED` | 链上交易已验证         | 系统      |
| `CONFIRMED`        | 卖家已确认收款         | 卖家      |
| `COMPLETED`        | 交付完成               | 卖家      |
| `CANCELLED`        | 订单已取消             | 买家/卖家 |
| `REFUND_REQUESTED` | 买家申请退款           | 买家      |
| `REFUNDED`         | 退款已完成             | 管理员    |

## 部署指南

### 前置要求

- Node.js >= 20.x
- Docker & Docker Compose（用于本地 PostgreSQL 和 MinIO）

### 快速开始（本地开发）

```bash
# 1. 克隆仓库
git clone <repo-url> && cd my-skill-store-v2

# 2. 安装依赖
npm install

# 3. 启动基础设施（PostgreSQL + MinIO）
cp .env.example .env  # 编辑 .env 设置密码
docker-compose up -d

# 4. 配置 API 环境变量
cp apps/api/.env.example apps/api/.env
# 编辑 .env 文件（参考下方环境变量说明）

# 5. 启动开发服务器
npm run dev:api   # API 运行在 http://localhost:8080
npm run dev:web   # Web 运行在 http://localhost:3000
```

### 环境变量

**API (`apps/api/.env`)**：

```env
# 数据库
DATABASE_URL=postgresql://admin:password@localhost:5432/myskillshop
# 或分别配置：
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password
DB_DATABASE=myskillshop

# 认证
JWT_SECRET=你的密钥

# S3 对象存储
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=myskillstore
S3_ACCESS_KEY=<你的访问密钥>
S3_SECRET_KEY=<你的私有密钥>
S3_REGION=us-east-1

# 应用
NODE_ENV=development
PORT=8080
CORS_ORIGINS=http://localhost:3000
```

**Web (`apps/web/.env.local`)**：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 构建

```bash
# 构建所有工作区
npm run build

# 单独构建
npm run build --workspace=apps/api
npm run build --workspace=apps/web
```

### Docker 部署

```bash
# 构建镜像
docker build -f api.Dockerfile -t myskillstore-api .
docker build -f web.Dockerfile -t myskillstore-web .
```

## 项目脚本

| 命令              | 说明                     |
| ----------------- | ------------------------ |
| `npm run dev:web`  | 启动 Next.js 开发服务器  |
| `npm run dev:api`  | 启动 NestJS 开发服务器   |
| `npm run build`    | 构建所有工作区           |
| `npm run test`     | 运行所有工作区测试       |

## 许可证

私有项目 - 保留所有权利。
