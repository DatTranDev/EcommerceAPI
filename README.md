# 🛒 E-Commerce Backend API

This is a RESTful backend for an e-commerce platform built using **Node.js**, **Express.js**, and **MySQL**. It provides core functionalities such as product listing, category filtering, search, order creation, payment handling, voucher application, and sending order confirmation emails.

## 📦 Features

- User authentication (login/register)
- Product & Category management
- Full-text product search with filters
- Order creation with payment and voucher support
- Asynchronous email confirmation on order success
- MySQL integration with pooled connections
- RESTful API design
- Swagger documentation

---

## 🧰 Technologies Used

- Node.js + Express.js
- MySQL
- Nodemailer (for email)
- Swagger UI (for API docs)
- dotenv (environment config)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
Create a .env file and fill in your credentials:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce_db

EMAIL_USER=youremail@example.com
EMAIL_PASS=yourEmailPassword
```
### 4. Start the server
```bash
npm start
```
### 📚 API Documentation
Swagger UI is available at:
```bash
http://localhost:3000/api-docs
```
