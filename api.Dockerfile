# 阶段 1：构建环境
FROM node:20-slim AS builder

WORKDIR /app

# 复制依赖定义文件
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# 安装所有依赖（包括 devDependencies 用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建后端 API
RUN date > /app/api_build_date.txt && npm run build --workspace=apps/api

# 阶段 2：生产运行环境
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# 统一使用 Render 端口
ENV PORT=10000

# 复制构建产物和必要的依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# 暴露端口
EXPOSE 10000

# 启动命令
CMD ["node", "dist/main"]
