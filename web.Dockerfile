# 阶段 1：构建环境 - 使用 Debian 镜像
FROM node:20-slim AS builder
WORKDIR /app

# 复制依赖定义
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# 安装依赖
RUN npm ci

# 显式安装适用于 Debian (GNU) 的原生绑定包，彻底解决 Tailwind v4 在 Docker 中的兼容性问题
RUN npm install --save-dev lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu --workspace=apps/web

# 复制源码
COPY . .

# 设置构建时的环境变量（提供一个占位符，防止构建失败，真正的值在运行时由 Render 注入）
ARG NEXT_PUBLIC_API_URL=https://api-placeholder-build-time
# ⚠️ 注意：不要用 ENV 指令将其固化到镜像中，否则可能干扰运行时的注入
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# 打印构建时的 API URL 以便调试
RUN echo "Building with API URL: $NEXT_PUBLIC_API_URL"

# 增加时间戳强制让构建步骤重新执行，确保环境变量生效
RUN date > /app/build_date.txt

# 构建前端
RUN npm run build --workspace=apps/web

# 阶段 2：生产运行环境
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# 统一使用 Render 默认端口
ENV PORT=10000
ENV HOSTNAME="0.0.0.0"

# 复制 Next.js standalone 构建产物
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/messages ./apps/web/messages

EXPOSE 10000

# 启动命令：启动前打印关键环境变量，确认 Render 注入是否成功
CMD ["sh", "-c", "echo 'Starting web server...' && echo \"SERVER_API_URL is: $SERVER_API_URL\" && node apps/web/server.js"]
