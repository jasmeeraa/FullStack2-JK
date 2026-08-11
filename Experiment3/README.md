# Secure Authentication System Using JSON Web Tokens (JWT)

## Aim
To design and implement a secure authentication system using JWT for user login and session management in a beginner-friendly full-stack web application.

## Objectives
1. Understand authentication mechanisms in web applications.
2. Implement token-based authentication using JWT.
3. Manage user sessions using a stateless architecture.
4. Handle token storage and validation securely.

## Technologies Used
- Frontend: React.js + Vite
- Backend: Node.js + Express.js
- Authentication: JSON Web Token (JWT)
- Password hashing: bcrypt
- HTTP client: Axios
- Styling: CSS
- Language: JavaScript

## JWT Theory
A JSON Web Token (JWT) is a compact, URL-safe token used to securely transmit information between parties. It contains a header, payload, and signature. JWTs are commonly used for authentication because the server can verify the token without keeping a server-side session for each user.

### JWT Structure
A JWT looks like this:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluIn0.signature

#### Header
The header includes the token type and signing algorithm, typically:

{
  "alg": "HS256",
  "typ": "JWT"
}

#### Payload
The payload contains user data such as userId, email, and name. It is encoded and not encrypted unless you use additional measures.

#### Signature
The signature is created by hashing the header + payload with the secret key. This allows the server to verify that the token was not modified.

## Authentication Flow
1. User registers by providing name, email, and password.
2. Server hashes the password with bcrypt before storing it.
3. User logs in with email and password.
4. Server checks the password and generates a JWT.
5. JWT is sent to the client and stored in sessionStorage for this lab.
6. Client sends JWT in the Authorization header for protected routes.
7. Server verifies the token using the JWT secret.
8. If valid, the protected route returns user information.

## Project Structure
```text
jwt-auth-experiment/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── middleware/
│   │   └── authenticateToken.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── README.md
└── .gitignore
```

## Installation
From the project root, run:

```bash
cd jwt-auth-experiment/server
npm install

cd ../client
npm install
```

## Start the Backend
```bash
cd jwt-auth-experiment/server
npm run dev
```

The server runs at:

http://localhost:5000

## Start the Frontend
```bash
cd jwt-auth-experiment/client
npm run dev
```

The frontend runs at:

http://localhost:5173

## API Endpoints
### Register user
- POST /api/auth/register

Request body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepass123"
}
```

### Login user
- POST /api/auth/login

Request body:
```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

### Get authenticated user
- GET /api/auth/me

Requires:
```http
Authorization: Bearer <token>
```

## How JWT is Stored and Sent
For this educational experiment, the JWT is stored in sessionStorage on the browser.

```js
sessionStorage.setItem('jwtToken', token);
```

When the frontend calls a protected route, it sends the token in the Authorization header:

```js
headers: {
  Authorization: `Bearer ${token}`,
}
```

> Security note: In production, HttpOnly secure cookies are preferred over sessionStorage to reduce exposure to JavaScript-based attacks like XSS.

## How Protected Routes Work
The server contains a middleware named authenticateToken. It:
- Reads the Authorization header.
- Extracts the Bearer token.
- Verifies the JWT using the secret key.
- Rejects missing/expired/invalid tokens with HTTP 401.
- Attaches decoded user information to req.user.

## Security Considerations
- JWT secret is stored in a .env file and is never hard-coded.
- Passwords are never stored in plain text; bcrypt hashes them.
- Duplicate email addresses are prevented.
- Input validation is applied to all forms.
- Expired tokens are rejected with 401 status.
- Only required user information is returned in API responses.
- CORS is enabled for the React frontend.

## Expected Outcome
After completing the experiment, the student should be able to:
- Register and log in users.
- Generate and validate JWT tokens.
- Store tokens safely in the browser for a lab environment.
- Protect API routes using middleware.
- Understand how stateless authentication works in a real web application.

## How this experiment satisfies the Aim and Objectives
This project demonstrates the main ideas behind JWT-based authentication in a practical and beginner-friendly way. It includes a secure registration endpoint, password hashing with bcrypt, JWT generation on login, protected route middleware, session management, and frontend route protection. The result is a full-stack experiment that explains how stateless authentication works in modern web applications.
