# JWT Authentication and Role-Based Authorization System

## Aim
To design and implement a simple frontend-only JWT authentication demo that explains user login, editor credential management, admin control, token storage, and role-based authorization for a college viva.

## Objectives
- Understand JWT concepts and structure
- Simulate JWT generation and decoding on the frontend
- Show how roles affect access to protected pages
- Demonstrate user registration and login
- Demonstrate editor-based user credential editing
- Demonstrate admin user management
- Explain the difference between a demo and a production-secure system

## Theory
A JSON Web Token has three main sections:

1. Header
2. Payload
3. Signature

The payload contains claims such as userId, name, email, role, and expiration time. In a real application, a trusted backend server signs and verifies the token. In this project, the token is simulated in the browser for educational purposes only.

A real JWT must be securely signed and verified by a trusted backend server. This project demonstrates JWT concepts and role-based authorization for educational purposes.

## JWT Structure
```text
Header.Payload.Signature
```

Example payload:
```json
{
  "userId": 1,
  "name": "Administrator",
  "email": "admin@example.com",
  "role": "admin",
  "exp": 1730000000
}
```

Passwords are never stored inside the JWT payload.

## Authentication Flow
Login
↓
JWT generated
↓
Token stored in sessionStorage
↓
Token decoded and validated
↓
Role identified
↓
Access granted according to permissions

## Role Hierarchy
ADMIN
↓
EDITOR
↓
USER

## User Permissions
A User can:
- register
- log in through the User Login page
- view their own dashboard
- view their own account details
- logout

A User cannot:
- access the Admin Dashboard
- access the Editor Dashboard
- manage other users
- edit other user information
- delete users

## Editor Permissions
An Editor is responsible for editing user credentials details.

An Editor can:
- log in through the normal login page
- view the Editor Dashboard
- view normal users
- edit normal user details such as name, email, and password
- save updates
- logout

An Editor cannot:
- access the Admin Dashboard
- edit Admin accounts
- edit other Editors
- change roles
- delete Admin accounts
- create or manage Admins

## Admin Permissions
An Admin can:
- log in through the separate Admin Login page
- access the Admin Dashboard
- view all users, editors, and admins
- edit user or editor details
- create new editors
- delete normal users
- manage all user roles where appropriate
- logout

An Admin cannot be deleted by an Editor.

## Project Structure
```text
Experiment3/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── userStorage.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── .gitignore
```

## Installation
```bash
cd Experiment3/client
npm install
```

## How to run
```bash
cd Experiment3/client
npm run dev
```

## Default Accounts
Admin:
- Email: admin@example.com
- Password: admin123

Editor:
- Email: editor@example.com
- Password: editor123

Normal users can be registered from the Register page.

## Role-Based Access Rules
- User cannot access Admin Dashboard
- User cannot access Editor Dashboard
- Editor cannot access Admin Dashboard
- Editor can edit only users with role = user
- Editor cannot edit an Admin or another Editor
- Only Admin can create Editors
- Only Admin can manage all users
- Logout clears the JWT and redirects to login

## Frontend-Only Security Note
This is a frontend-only educational implementation. A real authentication system should perform JWT signing, verification, password hashing, and authorization on a secure backend.

## Viva Explanation
The application works as follows:

1. User or editor logs in from the main login page.
2. Admin logs in from the separate Admin Login page.
3. A JWT is generated on the frontend.
4. The token is stored in sessionStorage.
5. The app decodes the token to restore the current user.
6. Protected routes check the user role before allowing access.
7. Unauthorized users are redirected to their proper dashboard or login page.
8. Logout removes the token and clears the current user from state.

## Important Note
This experiment is meant to teach the concept of JWT-based authentication and role-based authorization in a simple way. It is not a production-ready authentication system and should not be treated as secure deployment code.
