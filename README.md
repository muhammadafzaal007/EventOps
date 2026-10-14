# EventOps – Event Operations & Management Platform

MERN stack: React (Vite) + Tailwind CSS, Node.js + Express, MongoDB Atlas.

## Structure

```
EventOps/
├── frontend/   React + Vite + Tailwind + Axios
└── backend/    Express + Mongoose
```

## Prerequisites

- Node.js 20+ and npm
- A MongoDB Atlas cluster (free M0 is fine)

## MongoDB Atlas setup

1. Create a cluster, then a database user (Database Access).
2. Allow your IP (Network Access).
3. Connect → Drivers → copy the connection string and add the database name `eventops`.

## Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI
npm run dev              # http://localhost:5000
```

`backend/.env`

| Variable     | Description                                   |
|--------------|-----------------------------------------------|
| `NODE_ENV`   | `development` or `production`                 |
| `PORT`       | API port (default `5000`)                     |
| `MONGO_URI`  | MongoDB Atlas connection string               |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated       |
| `JWT_SECRET` | Long random string used to sign tokens (required) |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)             |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Only used by `npm run seed:admin` |

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

`frontend/.env`

| Variable       | Description                              |
|----------------|------------------------------------------|
| `VITE_API_URL` | Backend base URL (`http://localhost:5000/api`) |

## Test the health check

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{ "success": true, "message": "EventOps API is running", "database": "connected", "timestamp": "..." }
```

The frontend home page also calls this endpoint and shows the backend status.

## Authentication

Roles: `student`, `organizer`, `admin`. Public registration creates **students only**.
Create the first admin with `cd backend && npm run seed:admin` (change the password afterwards).

| Method | Endpoint             | Access  | Notes |
|--------|----------------------|---------|-------|
| POST   | `/api/auth/register` | public  | multipart/JSON: name, email, password, studentId, department, optional `studentCard` image |
| POST   | `/api/auth/login`    | public  | `{ email, password }` -> `{ token, user }` |
| GET    | `/api/auth/me`       | token   | current user |
| PUT    | `/api/auth/profile`  | token   | name, department, optional `profileImage` |

Send the token as `Authorization: Bearer <token>`.

Protect backend routes:

```js
router.get('/x', authMiddleware, roleMiddleware('admin', 'organizer'), handler)
```

Protect frontend routes:

```jsx
<Route element={<ProtectedRoute allowedRoles={['admin']} />}> ... </Route>
```

Uploads are saved to `backend/uploads/` and served at `/uploads/...`.

## Backend layout

```
backend/
├── server.js               entry point (DB connect + listen)
└── src/
    ├── app.js              Express app, CORS, middleware, routes
    ├── config/             env.js, db.js
    ├── routes/             route definitions (index.js mounts all under /api)
    ├── controllers/        request handlers
    ├── middlewares/        auth, role, upload, error handling
    ├── validators/         request validation
    ├── scripts/            seedAdmin.js
    ├── models/             Mongoose models (added per feature)
    ├── services/           business logic
    └── utils/
```

## Frontend layout

```
frontend/src/
├── api/        Axios instance (adds JWT, handles 401)
├── context/    AuthContext + AuthProvider
├── services/   API calls per feature
├── components/ ProtectedRoute, FormField
├── pages/      Home, Login, Register, Profile, Unauthorized
├── layouts/    MainLayout
├── hooks/      useAuth
└── utils/
```
