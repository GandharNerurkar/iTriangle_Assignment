# Mini ERP Backend

Node.js + Express + PostgreSQL backend for order management.

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Run `npm install`.
3. Create the database and run `npm run db:init`.
4. Start the server:
   - `npm run dev` for development
   - `npm start` for production

## API Endpoints

- `POST /api/customers`
- `GET /api/customers`
- `PUT /api/customers/:id`
- `POST /api/products`
- `GET /api/products`
- `PUT /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
