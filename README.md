# AI-CRM System

An AI-powered Customer Relationship Management system with authentication and role-based access control.

## Features

- User authentication with JWT
- Role-based access control (Admin, HR, Employee)
- Dashboard with analytics
- Lead management
- Dark/Light mode
- MongoDB integration

## Setup Instructions

### Frontend

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install server dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:

   ```
   MONGODB_URI=mongodb+srv://admin:sreeram@cluster0.d49rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=7023f50e70713797a8b54507815ece3c8105c5f7eae0fb68c14885b9dbf99788b90e93dfcba614d6b2abbaf539f46a133a1cf25b02456abac35928952a0edc55
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src` - Frontend React application
  - `/components` - React components
  - `/context` - React context for state management
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and helpers
- `/server` - Backend Express.js server

## Authentication

The system supports three user roles:

- **Admin**: Full access to all features
- **HR**: Access to employee management and analytics
- **Employee**: Limited access to basic features

## Technologies Used

- React.js with TypeScript
- Tailwind CSS for styling
- Express.js for the backend API
- MongoDB for database
- JWT for authentication
