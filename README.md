# User Authentication API

This project implements a robust user authentication API with features including registration, email verification, login, password reset, and user profile management.

# Table of Contents

1. [Features](#features)
2. [API Endpoints](#api-endpoints)
    - [Public Routes](#public-routes)
    - [Private Routes](#private-routes)
3. [Technologies Used](#technologies-used)
4. [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Swagger Documentation](#swagger-documentation)
    - [Email Configuration](#email-configuration)
5. [Logging](#logging)
6. [Database Connection](#database-connection)
7. [User Model](#user-model)
    - [Schema](#schema)
    - [Interfaces](#interfaces)
    - [Methods](#methods)
    - [Pre-save Hook](#pre-save-hook)
8. [Middleware](#middleware)
    - [Authentication Middleware](#authentication-middleware)
    - [CORS Middleware](#cors-middleware)
9. [Utilities](#utilities)
    - [JWT Token Generation](#jwt-token-generation)
    - [Validation Schemas](#validation-schemas)
10. [Setup](#setup)
11. [Usage](#usage)
12. [Security Features](#security-features)
13. [Error Handling](#error-handling)
14. [Contributing](#contributing)
15. [License](#license)


## Features

- User registration with email verification
- Login and logout functionality
- Password reset via email
- User profile management (view, update, delete)
- Email notifications for account actions

## API Endpoints

### Public Routes

- `POST /api/v1/user/register`: Register a new user
- `POST /api/v1/user/account/verify`: Resend email verification
- `POST /api/v1/user/verify/:token`: Verify user's email
- `POST /api/v1/user/login`: User login
- `POST /api/v1/user/logout`: User logout
- `POST /api/v1/user/reset-password`: Request password reset link
- `POST /api/v1/user/reset-password/:token`: Verify password reset token
- `POST /api/v1/user/generate-password/:token`: Generate new password after reset

### Private Routes

- `GET /api/v1/user/profile`: Get user profile
- `PATCH /api/v1/user/update`: Update user information
- `DELETE /api/v1/user/delete`: Delete user account

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (assumed, based on the use of models)
- JWT for authentication
- Nodemailer for sending emails

## Configuration

### Environment Variables

The project uses the following environment variables:

- `NODE_ENV`: Set to "development" or "test"
- `SERVER_HOSTNAME`: Server hostname (default: "localhost")
- `SERVER_PORT`: Server port (default: 12345)
- `EMAIL_USERNAME`: Email username for sending notifications
- `EMAIL_PASSWORD`: Email password for sending notifications
- `DB_URI`: MongoDB connection URI
- `JWT_SECRET_KEY`: Secret key for JWT token generation (default: "12313456165")

### Swagger Documentation

The API is documented using Swagger:

- OpenAPI version: 3.0.0
- Title: Authentication API
- Version: 1.0.0
- Server URL: `http://${SERVER_HOSTNAME}:${SERVER_PORT}/api/docs`

### Email Configuration

Nodemailer is configured to use Gmail SMTP:

- Service: Gmail
- Host: smtp.gmail.com
- Port: 587
- Secure: false

### Logging

A custom logging utility is implemented with color-coded console outputs:

- `log`: General logging (magenta)
- `info`: Information logging (cyan)
- `warn`: Warning logging (yellow)
- `error`: Error logging (red)

Logging includes timestamps and calling function names.

### Database Connection

MongoDB connection is established using Mongoose:

- Connection string is set via the `DB_URI` environment variable
- Successful connection and errors are logged


### User Model

The User model is defined using Mongoose and represents the structure of user data in the database.

#### Schema

The User schema includes the following fields:

- `username`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `isVerified`: Boolean
  - Default: false
- `verificationToken`: String (unique)
- `passresetToken`: String
- `passresetTokenExp`: Date

The schema also includes timestamps (`createdAt` and `updatedAt`).

#### Interfaces

Two interfaces are defined:

1. `IUser`: Extends `Document` and defines the structure of a user document.
2. `IUserModel`: Extends `Model<IUser>` for potential static methods.

#### Methods

- `matchPassword(enteredPassword: string): Promise<boolean>`
  - Compares entered password with stored hashed password using bcrypt

#### Pre-save Hook

A pre-save hook is implemented to automatically hash the password before saving if it has been modified:

- Uses bcrypt with a salt round of 10
- Only hashes the password if it has been modified

## Middleware

The application uses several middleware functions to handle various aspects:

1. **Route Not Found Middleware**: Handles 404 errors for undefined routes.
2. **Logging Middleware**: Logs incoming requests and outgoing responses.
3. **Authentication Middleware**: Verifies JWT tokens for protected routes.
4. **CORS Middleware**: Handles Cross-Origin Resource Sharing settings.

### Authentication Middleware

The `isAuthenticated` middleware:
- Checks for a valid JWT token in the request cookies
- Verifies the token and attaches the user object to the request
- Used to protect private routes

### CORS Middleware

The CORS middleware:
- Sets appropriate headers for cross-origin requests
- Handles preflight OPTIONS requests
- Allows credentials to be included in cross-origin requests

## Utilities

### JWT Token Generation

The project includes a utility function for generating and setting JWT tokens:

- `settoken(res: Response, payload: object)`: 
  - Generates a JWT token with the provided payload
  - Sets the token as an HTTP-only cookie named "session_cookie"
  - Cookie is set with strict same-site policy and expires in 7 days

## Validation Schemas

The API uses Zod for input validation. The following schemas are defined:

1. `emailSchema`: Validates email input
2. `registerSchema`: Validates user registration data
3. `loginSchema`: Validates login credentials
4. `verifyEmailSchema`: Validates email verification token
5. `resetPasswordSchema`: Validates password reset request
6. `verifyPasswordSchema`: Validates password reset token
7. `generatePasswordSchema`: Validates new password generation
8. `updateUserSchema`: Validates user profile update data

Key features of the validation schemas:

- Email validation
- Password strength requirements (min 8 characters, uppercase, lowercase, number, special character)
- Username length restrictions (4-30 characters)
- Role validation (TUTOR or USER)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (database connection, JWT secret, email configuration)
4. Run the server: `npm start`

## Usage

1. Register a new user by sending a POST request to `/api/v1/user/register`
2. Verify the user's email using the link sent to their email
3. Log in using the `/api/v1/user/login` endpoint
4. Use the authenticated routes to manage the user profile

## Security Features

- Password hashing (implied by the `matchPassword` method)
- JWT-based authentication with secure cookie storage
- Email verification for new accounts
- Secure password reset flow with time-limited tokens
- CORS protection
- Input validation using Zod schemas

## Error Handling

The API includes basic error handling and logging. Ensure proper logging configuration for production use.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to improve the project.

## License

[Add your chosen license here]
