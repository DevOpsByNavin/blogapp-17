# Backend1 Directory Overview

## Description
The `services/backend1` directory contains one of two backend API services for the Blog-App, built with Node.js, TypeScript, and Express. This service handles specific backend operations with PostgreSQL database integration.

## Tech Stack
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.8.3
- **Database**: PostgreSQL with Knex.js 3.1.0 query builder
- **Authentication**: Clerk SDK (@clerk/clerk-sdk-node) 5.1.6
- **Logging**: Winston 3.17.0
- **Dev Tools**: Nodemon, TSLint, Prettier

## Directory Structure
```
services/backend1/
├── src/
│   ├── constants/       # Application constants
│   ├── controllers/     # Request handlers
│   ��── db/             # Database config & migrations
│   ├── domain/         # Business logic
│   ├── enums/          # TypeScript enums
│   ├── logging/        # Winston logging config
│   ├── maps/           # Data mappers
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── schemas/        # Validation schemas
│   ├── services/       # Business services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper utilities
│   └── index.ts        # Application entry point
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env.example
```

## Key Features
- **Database Migrations**: Knex.js for database schema management
- **Authentication**: Clerk integration for secure user management
- **Structured Logging**: Winston for production-ready logging
- **Type Safety**: Full TypeScript implementation
- **Auto-reload**: Nodemon for development hot-reloading

## Available Scripts
- `npm start` - Start development server with Nodemon
- `npm run build` - Compile TypeScript
- `npm run migrate` - Run database migrations
- `npm run rollback` - Rollback last migration
- `npm run migration:make` - Create new migration
- `npm run format:code` - Format and lint code