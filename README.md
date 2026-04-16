# Mini ERP Order Management System

A full-stack ERP-style Order Management Dashboard that allows users to manage **Customers, Products, and Orders** with a clean UI and scalable backend.

---

##  Features

### Customers

* Add and manage customers
* Unique email validation
* View customer list

### Products

* Create and update products
* Manage product stock
* Prevent ordering when stock is unavailable

### Orders

* Create orders with multiple items
* Automatic subtotal, tax, and total calculation
* View all orders
* Click on an order to view detailed order information (modal view)

### Dashboard

* Total customers, products, orders
* Revenue calculation
* Summary cards UI

---

## Tech Stack

### Frontend

* React (TypeScript)
* Redux Toolkit
* Material UI

### Backend

* Node.js
* Express.js
* PostgreSQL

---

## Project Structure

```
mini-erp/
  Frontend/
  Backend/
```

---

# Frontend

## Structure

```
Frontend/
├── dist/                  # Production build output
├── node_modules/          # Dependencies
├── src/
│   ├── components/
│   │   └── common/        # Reusable components
│   │       ├── AlertSnackbar.tsx
│   │       ├── DataTable.tsx
│   │       ├── FormInput.tsx
│   │       ├── LoadingIndicator.tsx
│   │       ├── ModalForm.tsx
│   │       ├── SelectDropdown.tsx
│   │       └── SummaryCard.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAppDispatch.ts
│   │   └── useAppSelector.ts
│   ├── pages/             # Page components
│   │   ├── CreateOrderPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── ProductsPage.tsx
│   ├── redux/             # State management
│   │   ├── slices/        # Redux slices
│   │   └── store.ts       # Redux store configuration
│   ├── services/          # API service layer
│   │   ├── api.ts
│   │   ├── customerService.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── format.ts
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Application entry point
│   ├── styles.css         # Global styles
│   └── vite-env.d.ts      # Vite environment types
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

---

## Frontend Architecture

* **components/** → Reusable UI components
* **pages/** → Route-based screens
* **redux/** → Global state management
* **services/** → API abstraction layer
* **hooks/** → Custom typed hooks
* **types/** → Centralized TypeScript types
* **utils/** → Helper functions

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Create `.env`

```
VITE_API_BASE_URL=http://localhost:4001/api
```

---

# Backend

## Structure


### Backend Structure

```
Backend/
├── node_modules/          # Dependencies
├── sql/
│   └── schema.sql         # Database schema
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   │   ├── customerController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middlewares/       # Custom middleware
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── requestLogger.js
│   ├── models/            # Database models
│   │   ├── customerModel.js
│   │   ├── orderModel.js
│   │   └── productModel.js
│   ├── routes/            # API routes
│   │   ├── customerRoutes.js
│   │   ├── index.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── scripts/           # Utility scripts
│   │   └── initDb.js
│   ├── services/          # Business logic
│   │   ├── customerService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   ├── utils/             # Helper functions
│   │   ├── apiError.js
│   │   ├── response.js
│   │   └── validators.js
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package-lock.json      # Dependency lock file
└── package.json           # Project metadata and dependencies
```

---

## Backend Architecture

* **controllers/** → Handle HTTP requests
* **services/** → Business logic layer
* **models/** → Database queries
* **routes/** → API routes
* **config/** → DB & environment setup
* **utils/** → Error handling & helpers

---

## Backend Setup

```bash
cd Backend
npm install
```

### Create `.env`

```
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=your_db
PG_USER=your_user
PG_PASSWORD=your_password
PORT=4001
PG_MAX=10
```

---

## Initialize Database

```bash
npm run db:init
```

---

##  Run Backend

```bash
npm start
```

---

## API Endpoints

### Customers

* `GET /api/customers`
* `POST /api/customers`
* `PUT /api/customers/:id`

### Products

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/:id`

### Orders

* `GET /api/orders`
* `GET /api/orders/:id`
* `POST /api/orders`

---

## Key Functionalities

* Order creation 
* Stock validation before placing orders
* Modal-based order detail view
* Pagination for large datasets
* Centralized error handling using custom ApiError


---



##  Author

Gandhar Nerurkar
