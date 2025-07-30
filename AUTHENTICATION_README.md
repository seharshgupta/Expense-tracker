# Authentication System for Expense Tracker

## Overview
A complete authentication system has been added to the expense tracker application, including user registration, login, and secure API access.

## Features Added

### Frontend Components
1. **Login Component** (`frontend/src/Components/Auth/Login.js`)
   - Email and password authentication
   - Form validation
   - Error handling
   - Modern UI design

2. **Signup Component** (`frontend/src/Components/Auth/Signup.js`)
   - User registration with name, email, and password
   - Password confirmation
   - Form validation
   - Modern UI design

### Backend Components
1. **User Model** (`backend/models/UserModel.js`)
   - User schema with name, email, and password
   - Password hashing using bcryptjs
   - Password comparison method

2. **Authentication Controller** (`backend/controllers/auth.js`)
   - User registration (signup)
   - User login
   - JWT token generation
   - Token verification middleware

3. **Authentication Routes** (`backend/routes/auth.js`)
   - POST `/api/v1/signup` - User registration
   - POST `/api/v1/login` - User login

## Security Features

### Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Minimum password length of 6 characters
- Password confirmation on signup

### JWT Authentication
- JWT tokens for session management
- Token expiration set to 30 days
- Secure token storage in localStorage
- Token verification middleware for protected routes

### User-Specific Data
- All expenses and incomes are now associated with specific users
- Users can only access their own data
- Protected API endpoints require authentication

## API Endpoints

### Public Endpoints
- `POST /api/v1/signup` - Register new user
- `POST /api/v1/login` - User login

### Protected Endpoints (require authentication)
- `POST /api/v1/add-income` - Add income
- `GET /api/v1/get-incomes` - Get user's incomes
- `DELETE /api/v1/delete-income/:id` - Delete income
- `POST /api/v1/add-expense` - Add expense
- `GET /api/v1/get-expenses` - Get user's expenses
- `DELETE /api/v1/delete-expense/:id` - Delete expense

## Usage

### User Registration
1. Navigate to `/signup` or click "Sign up" on login page
2. Fill in name, email, and password
3. Confirm password
4. Submit form to create account

### User Login
1. Navigate to `/login`
2. Enter email and password
3. Submit form to authenticate

### Logout
- Click "Sign Out" in the navigation sidebar
- This will clear all user data and redirect to login page

## Environment Variables

Add the following to your `.env` file:
```
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Dependencies

### Backend
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token management

### Frontend
- No additional dependencies required

## Security Notes

1. **JWT Secret**: Change the JWT secret in production
2. **HTTPS**: Use HTTPS in production for secure token transmission
3. **Token Storage**: Consider using httpOnly cookies for better security
4. **Password Policy**: Consider implementing stronger password requirements
5. **Rate Limiting**: Consider adding rate limiting for auth endpoints

## Database Changes

The existing expense and income collections will need to be updated to include user references. New records will automatically include user IDs, but existing records may need migration.

## Testing

1. Start the backend server: `npm start`
2. Start the frontend: `npm start`
3. Navigate to the application
4. Try registering a new user
5. Test login/logout functionality
6. Verify that data is user-specific 