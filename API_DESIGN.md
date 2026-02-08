# API Design (Draft)

## Users
- `POST /auth/login` - OAuth login
- `GET /users/me` - Get profile
- `PUT /users/me/payment` - Update crypto payment info

## Products
- `GET /products` - List public products (search/filter)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Draft)
- `PUT /products/:id/submit` - Submit for review
- `GET /admin/products/pending` - (Admin) List pending review
- `POST /admin/products/:id/review` - (Admin) Approve/Reject

## Orders
- `POST /orders` - Create order
- `GET /orders` - List my orders (As buyer or seller)
- `GET /orders/:id` - Get order detail
- `POST /orders/:id/pay` - Buyer marks as paid
- `POST /orders/:id/confirm` - Seller confirms payment
- `GET /orders/:id/delivery` - Get download link (if access granted)

## Files
- `POST /files/upload` - Upload skill package (Returns temporary key)
