# API 接口设计 — MySkillStore v2

**基础路径**：`/api`
**认证方式**：JWT Bearer Token（通过 `Authorization: Bearer <token>` 请求头）
**全局校验**：`ValidationPipe`，开启 `whitelist: true` 和 `transform: true`

---

## 认证模块 (Auth)

| 方法 | 端点                 | 权限     | 说明                    |
| ---- | -------------------- | -------- | ----------------------- |
| POST | `/api/auth/register` | 公开     | 注册新用户              |
| POST | `/api/auth/login`    | 公开     | 登录，返回 JWT Token    |
| GET  | `/api/auth/profile`  | JWT      | 获取当前用户资料        |

---

## 用户模块 (Users)

| 方法 | 端点              | 权限           | 说明                     |
| ---- | ----------------- | -------------- | ------------------------ |
| POST | `/api/users`      | 管理员         | 创建用户（仅管理员）     |
| GET  | `/api/users`      | 管理员         | 获取所有用户列表         |
| GET  | `/api/users/:id`  | JWT（本人/管理员）| 根据 ID 获取用户信息  |
| PUT  | `/api/users/:id`  | JWT（本人/管理员）| 更新用户资料          |

---

## 商品模块 (Products)

| 方法   | 端点                                  | 权限   | 说明                          |
| ------ | ------------------------------------- | ------ | ----------------------------- |
| GET    | `/api/products`                       | 公开   | 商品列表（支持搜索/筛选）     |
| GET    | `/api/products/categories`            | 公开   | 获取商品分类列表              |
| GET    | `/api/products/my/list`               | JWT    | 获取卖家自己的商品列表        |
| GET    | `/api/products/admin/pending`         | 管理员 | 获取待审核商品列表            |
| GET    | `/api/products/:id`                   | 公开   | 获取商品详情                  |
| POST   | `/api/products`                       | JWT    | 创建商品（状态：待审核）      |
| PUT    | `/api/products/:id`                   | JWT    | 更新自己的商品                |
| DELETE | `/api/products/:id`                   | JWT    | 删除自己的商品                |
| PUT    | `/api/products/admin/:id/approve`     | 管理员 | 审核通过商品                  |
| PUT    | `/api/products/admin/:id/reject`      | 管理员 | 拒绝商品（附理由）            |

**查询参数** (`GET /api/products`)：

| 参数           | 类型   | 说明                               |
| -------------- | ------ | ---------------------------------- |
| `status`       | string | 按状态筛选（如 `approved`）        |
| `search`       | string | 关键词搜索（标题/描述）            |
| `category`     | string | 按分类筛选                         |
| `tags`         | string | 按标签筛选（逗号分隔）             |
| `minPrice`     | number | 最低价格（USD）                    |
| `maxPrice`     | number | 最高价格（USD）                    |
| `deliveryType` | string | `auto_hosted` 或 `manual`          |
| `sellerId`     | number | 按卖家筛选                         |
| `sortBy`       | string | 排序字段（如 `price`、`created_at`）|
| `sortOrder`    | string | `ASC` 或 `DESC`                    |
| `page`         | number | 页码（默认：1）                    |
| `limit`        | number | 每页数量（默认：20）               |

---

## 订单模块 (Orders)

| 方法 | 端点                         | 权限   | 说明                              |
| ---- | ---------------------------- | ------ | --------------------------------- |
| POST | `/api/orders`                | JWT    | 创建订单（买家）                  |
| GET  | `/api/orders`                | 管理员 | 获取所有订单（仅管理员）          |
| GET  | `/api/orders/my/purchases`   | JWT    | 获取我的购买订单                  |
| GET  | `/api/orders/my/sales`       | JWT    | 获取我的销售订单                  |
| GET  | `/api/orders/:id`            | JWT    | 获取订单详情                      |
| PUT  | `/api/orders/:id/pay`        | JWT    | 报告支付（提交交易哈希 + 网络）   |
| PUT  | `/api/orders/:id/verify`     | JWT    | 链上验证支付                      |
| PUT  | `/api/orders/:id/confirm`    | JWT    | 卖家确认收款                      |
| PUT  | `/api/orders/:id/complete`   | JWT    | 标记订单完成                      |
| PUT  | `/api/orders/:id/cancel`     | JWT    | 取消订单                          |
| GET  | `/api/orders/:id/delivery`   | JWT    | 获取交付内容（仅买家）            |

---

## 评价模块 (Reviews)

| 方法 | 端点                                        | 权限 | 说明                         |
| ---- | ------------------------------------------- | ---- | ---------------------------- |
| POST | `/api/reviews`                              | JWT  | 创建评价（买家，每订单限一次）|
| GET  | `/api/reviews/product/:productId`           | 公开 | 获取商品评价列表             |
| GET  | `/api/reviews/product/:productId/rating`    | 公开 | 获取商品平均评分             |
| GET  | `/api/reviews/seller/:sellerId`             | 公开 | 获取卖家评价列表             |
| GET  | `/api/reviews/seller/:sellerId/rating`      | 公开 | 获取卖家平均评分             |

---

## 退款模块 (Refunds)

| 方法 | 端点                         | 权限   | 说明                        |
| ---- | ---------------------------- | ------ | --------------------------- |
| POST | `/api/refunds`               | JWT    | 申请退款（买家）            |
| GET  | `/api/refunds/my`            | JWT    | 获取我的退款申请列表        |
| GET  | `/api/refunds`               | 管理员 | 获取所有退款列表            |
| GET  | `/api/refunds/:id`           | 管理员 | 获取退款详情                |
| PUT  | `/api/refunds/:id/process`   | 管理员 | 审批退款（通过/拒绝）       |
| PUT  | `/api/refunds/:id/complete`  | 管理员 | 完成退款（附交易哈希）      |

---

## 博客模块 (Blog)

| 方法   | 端点                    | 权限   | 说明                    |
| ------ | ----------------------- | ------ | ----------------------- |
| GET    | `/api/blog`             | 公开   | 获取博客文章列表        |
| GET    | `/api/blog/:idOrSlug`   | 公开   | 根据 ID 或 slug 获取文章 |
| POST   | `/api/blog`             | 管理员 | 创建博客文章            |
| PUT    | `/api/blog/:id`         | 管理员 | 更新博客文章            |
| DELETE | `/api/blog/:id`         | 管理员 | 删除博客文章            |

---

## 通知模块 (Notifications)

| 方法 | 端点                              | 权限 | 说明                    |
| ---- | --------------------------------- | ---- | ----------------------- |
| GET  | `/api/notifications`              | JWT  | 获取我的通知列表        |
| GET  | `/api/notifications/unread-count` | JWT  | 获取未读通知数量        |
| PUT  | `/api/notifications/:id/read`     | JWT  | 标记通知为已读          |
| PUT  | `/api/notifications/read-all`     | JWT  | 标记所有通知为已读      |

**查询参数** (`GET /api/notifications`)：

| 参数     | 类型   | 说明                        |
| -------- | ------ | --------------------------- |
| `unread` | string | 设为 `true` 仅显示未读通知  |
| `page`   | number | 页码（默认：1）             |
| `limit`  | number | 每页数量（默认：20）        |

---

## 文件上传模块 (Upload)

| 方法 | 端点           | 权限 | 说明                            |
| ---- | -------------- | ---- | ------------------------------- |
| POST | `/api/upload`  | JWT  | 上传文件（multipart/form-data） |

**参数说明**：
- 请求体：`file`（form-data，最大 10MB）
- 查询参数：`folder`（可选，目标文件夹名称）
- 允许类型：jpg、jpeg、png、gif、webp、svg、pdf、zip

---

## 行为追踪模块 (Tracking)

| 方法 | 端点                   | 权限   | 说明                 |
| ---- | ---------------------- | ------ | -------------------- |
| POST | `/api/tracking/event`  | 公开   | 记录追踪事件         |
| GET  | `/api/tracking/stats`  | 管理员 | 获取追踪统计数据     |

---

## 健康检查 (Health)

| 方法 | 端点            | 权限 | 说明         |
| ---- | --------------- | ---- | ------------ |
| GET  | `/api/health`   | 公开 | 健康检查状态 |

---

## 权限角色说明

| 角色   | 说明                                                    |
| ------ | ------------------------------------------------------- |
| 公开   | 无需认证                                                |
| JWT    | 需要有效的 JWT Token（`Authorization: Bearer <token>`） |
| 管理员 | 需要 JWT + 用户角色为 `admin`                           |

## 错误响应格式

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```
