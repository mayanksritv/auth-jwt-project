# AuthVault — User Authentication & JWT

A modern, minimal authentication project implementing secure registration, login, password hashing with bcrypt, signed JWT sessions, HTTP-only cookies, protected middleware and logout.

## Live Application: https://auth-jwt-project-3zlg.onrender.com/

## Requirements covered

- `POST /api/auth/register` — creates a user and hashes the password with bcrypt.
- `POST /api/auth/login` — verifies the bcrypt hash and issues a signed JWT.
- JWT is stored in an **HTTP-only cookie** named `auth_token`, so browser JavaScript cannot read it.
- `requireAuth` middleware verifies the JWT signature/claims before a protected route runs.
- `GET /api/protected/profile` — protected API proving the middleware works.
- `POST /api/auth/logout` — clears the JWT cookie.
- Authentication endpoints are rate-limited.
- Passwords are never returned by the API and are excluded from normal user queries.
- Minimal responsive frontend included.
- Postman collection included in `postman/Auth-JWT.postman_collection.json`.

## Tech stack

Node.js · Express · MongoDB/Mongoose · bcryptjs · jsonwebtoken · HTTP-only cookies · vanilla HTML/CSS/JS · Postman

## Run locally

1. Install Node.js 20+.
2. Create a MongoDB database (MongoDB Atlas works well).
3. Copy `.env.example` to `.env`.
4. Replace `MONGODB_URI` with your real MongoDB connection string. Do **not** leave placeholder values such as `<cluster>` or `CLUSTER`.
5. Generate a strong `JWT_SECRET` (32+ random characters).
6. Install dependencies:

```bash
npm install
```

7. Start the app:

```bash
npm start
```

For development:

```bash
npm run dev
```

Open `http://localhost:5000`.

## API flow

```text
Register/Login
    ↓
Validate input
    ↓
bcrypt hash / compare password
    ↓
Sign JWT with JWT_SECRET
    ↓
Set HTTP-only auth_token cookie
    ↓
Protected request
    ↓
requireAuth middleware
    ↓
jwt.verify(...)
    ↓
GET /api/protected/profile
```

## Postman proof

Import `postman/Auth-JWT.postman_collection.json` into Postman and run the requests in this order:

1. Register
2. Login
3. Protected Profile
4. Logout

Postman keeps the cookie from the login response and sends it to the protected request. After Logout, calling Protected Profile again should return HTTP `401`.

## Deployment

For Render (or another Node host):

- Build command: `npm install`
- Start command: `npm start`
- Add `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, and `NODE_ENV=production` as environment variables.
- Never commit `.env`.
- In production the JWT cookie automatically receives the `Secure` flag.

## MongoDB Atlas security

For submission/testing, do not expose your database credentials in source code. Prefer a restricted IP allowlist instead of `0.0.0.0/0` when your deployment environment allows it. If a cloud host requires dynamic egress IPs, use the provider's documented network-access approach and rotate credentials if they were ever exposed.

## Folder structure

```text
.
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   └── protected.js
├── postman/
│   └── Auth-JWT.postman_collection.json
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Submission proof checklist

- GitHub repository with all source files
- Imported Postman collection
- Live demo URL, when deployed
- Screenshot/video showing Register → Login → Protected Profile → Logout
