# Frontend Directory Overview

## Description
The `services/frontend` directory contains the client-side application for the Blog-App project. It's a modern React-based single-page application built with TypeScript, Vite, and Material-UI.

## Tech Stack
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Library**: Material-UI (@mui/material) 7.1.1
- **Authentication**: Clerk (@clerk/clerk-react) 5.31.9
- **Routing**: React Router DOM 6.23.1
- **HTTP Client**: Axios 1.9.0
- **Rich Text Editor**: React Quill
- **Markdown Support**: Marked 15.0.12

## Directory Structure

```
services/frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application page components
│   ├── App.tsx          # Main application component with routing
│   ├── main.tsx         # Application entry point
│   ├── util.tsx         # Utility functions
│   └── *.css            # Styling files
├── public/              # Public static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.*.json      # TypeScript configuration files
├── eslint.config.js     # ESLint configuration
└── .env.example         # Environment variables template
```

## Key Features
- **Modern UI**: Built with Material-UI components for a polished user interface
- **Authentication**: Integrated with Clerk for secure user authentication
- **Rich Text Editing**: Supports blog post creation with React Quill editor
- **Markdown Rendering**: Converts and displays markdown content
- **Type Safety**: Full TypeScript support for better code quality
- **Code Quality**: ESLint configuration for consistent code style

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run clean` - Clean build artifacts

## Development
The frontend follows a modern React application structure with routing handled by React Router DOM. Authentication is managed through Clerk, and the UI leverages Material-UI's comprehensive component library for a consistent design system.