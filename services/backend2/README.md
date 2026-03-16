# Backend2 Directory Overview

## Description
The `services/backend2` directory contains the second backend API service for the Blog-App. Similar architecture to Backend1, built with Node.js, TypeScript, and Express, handling complementary backend operations.

## Tech Stack
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.8.3
- **Database**: PostgreSQL with Knex.js 3.1.0
- **Authentication**: Clerk SDK (@clerk/clerk-sdk-node) 5.1.6
- **Logging**: Winston 3.17.0
- **Dev Tools**: Nodemon, TSLint, Prettier

## Directory Structure
```
services/backend2/
├── src/
│   ├── constants/       # Application constants
│   ├── controllers/     # Request handlers
│   ├── db/             # Database config & migrations
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
- **Database Migrations**: Knex.js for schema management
- **Authentication**: Clerk SDK integration
- **Structured Logging**: Winston logger
- **Type Safety**: Full TypeScript support
- **Development Ready**: Hot-reloading with Nodemon

## Available Scripts
- `npm start` - Start development server with Nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm run migrate` - Run database migrations
- `npm run rollback` - Rollback migrations
- `npm run migration:make` - Create new migration
- `npm run format:code` - Format and lint code