# 📝 Task Manager API

Task Manager API is a RESTful service for managing tasks, users, and authentication. It is built using **Node.js, Express, PostgreSQL, and TypeScript**, with authentication handled via **JWT (public/private key encryption)**.

## Features

- **User Authentication** (Login, Register, Logout with JWT-based authentication)
- **Task Management** (Create, Update, Delete, Retrieve tasks, Task Priorities & Status updates, Task Comments)
- **User Management** (CRUD operations for users, Pagination support)
- **Swagger API Documentation**
- **Database Migrations & Seed Data**
- **Frontend Client Support** (React/Next.js)

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, Sequelize ORM
- **Authentication:** JWT (Public/Private Key Encryption)
- **Frontend:** React.js / Next.js
- **Documentation:** Swagger

## Installation & Setup

Clone the repository using `git clone`, then install backend dependencies with `npm install`. Navigate to the client directory and install dependencies using `cd client && npm install --legacy-peer-deps`. After that, configure the environment variables by creating a `.env` file in the backend root directory and adding the following (Use your own local data):

```env
DB_HOST=
DB_USER=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=

PUB_KEY=
PRIV_KEY=

## Swagger Docs

Swagger UI is available at http://localhost:5000/docs.