# Crowdfunding Platform

A secure and user-friendly crowdfunding platform built with React, Express.js, Node.js, and MongoDB.

## Features

- User Authentication & Authorization
- Project Creation and Management
- Secure Payment Processing with PayPal
- Real-time Communication
- Search and Filtering System
- Campaign Analytics
- Responsive Design

## Project Structure

```
crowdfunding-platform/
├── client/                 # React frontend
└── server/                 # Express.js backend
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- PayPal Developer Account

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```
3. Set up environment variables
4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Environment Variables

Create `.env` files in both client and server directories with the following variables:

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```
