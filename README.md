# Task Manager

A full-stack task management application with role-based access control, JWT authentication, and activity logging.

---

## Databases used (and why)

This project uses **two databases**, each for what it does best.

### PostgreSQL — for core relational data
- Stores `User`, `Role`, and `Task` records.
- Strict schema, foreign keys, and `JOIN`s fit naturally with how these entities relate.
- ACID transactions matter for user creation, task assignment, and ownership checks.
- Managed via **Prisma ORM** for type-safe queries and easy migrations.

### MongoDB — for activity logs
- Activity logs are append-only, schema-light, and read by time range — ideal for a document store.
- Each log entry has a flexible `details` payload that varies by action (`TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED`). A relational schema would force this into rigid columns.
- High write volume, low contention — MongoDB handles this efficiently without bloating the relational store.
- Managed via **Mongoose**.

**In one line:** Postgres for structured relational data, MongoDB for unstructured append-only logs.

---

## Tech Stack

### Backend (`tm-backend/`)
| Layer | Technology |
|---|---|
| Runtime | **Node.js** + **TypeScript** |
| Web framework | **Express 5** |
| Relational DB | **PostgreSQL 18** via **Prisma ORM** |
| Document DB | **MongoDB Atlas** via **Mongoose** |
| Auth | **JWT** (jsonwebtoken) + **bcrypt** password hashing |

### Frontend (`tm-frontend/`)
| Layer | Technology |
|---|---|
| Framework | **React 18** + **TypeScript** |
| Build tool | **Vite** |
| UI library | **Material-UI (MUI v6)**  |
| State management | **Redux Toolkit** + **React-Redux** |
| Routing | **React Router v6** |
| Forms | **React Hook Form** + **Zod** validation |
| HTTP client | **Axios** |

### Database Tooling
- **DBeaver** — PostgreSQL GUI client
- **MongoDB Atlas** — managed MongoDB cluster

---

## Local Setup

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 running locally
- **MongoDB Atlas** account (or a local MongoDB) — get a connection string
- **Git**

### 1. Clone and install
```powershell
git clone <repo-url>
cd Task-Manager

# Backend deps
cd tm-backend
npm install

# Frontend deps
cd ../tm-frontend
npm install
```

### 2. Configure environment variables
Create `tm-backend/.env`:
```env
PORT=5000
JWT_SECRET=<your-strong-secret-here>
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/task_manager"
MONGO_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/"
```
> **Note:** Whitelist your IP in MongoDB Atlas → Security → Network Access, otherwise the connection will fail with a TLS handshake error.

### 3. Initialize the database
```powershell
cd tm-backend

# Creates the database, applies migrations, generates Prisma Client
npx prisma migrate dev --name init

# Seed the default roles (admin, user) — required for registration to work
npx ts-node src/seed/seedRoles.ts
```

### 4. Run
```powershell
# Terminal 1 — backend (http://localhost:5000)
cd tm-backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd tm-frontend
npm run dev
```

### 5. Create an admin (optional)
Registration always creates a regular `user`. To promote a user to `admin`, run this SQL via DBeaver or `psql`:
```sql
UPDATE "User"
SET "roleId" = (SELECT id FROM "Role" WHERE name = 'admin')
WHERE email = '<your-email>';
```
Then log out and back in so the new role is in your JWT.

---

## API Documentation

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <jwt>` header.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new user (always with role `user`) |
| `POST` | `/api/auth/login` | Public | Authenticate; returns `{ token, user }` |
| `GET`  | `/api/auth/profile` | JWT | Returns the authenticated user's `{ id, name, email, role }` |
| `GET`  | `/api/auth/admin` | JWT + admin | Demo admin-only endpoint |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET`    | `/api/tasks?page=1&limit=10` | JWT | List tasks (users see their own; admins see all) |
| `GET`    | `/api/tasks/:id` | JWT | Get a single task |
| `POST`   | `/api/tasks` | JWT | Create a task |
| `PUT`    | `/api/tasks/:id` | JWT + owner/admin | Update a task |
| `DELETE` | `/api/tasks/:id` | JWT + owner/admin | Delete a task |

**Create payload:**
```json
{
  "title": "Set up CI/CD pipeline",
  "description": "Configure GitHub Actions for lint, test, deploy.",
  "assignedToId": "<user-uuid>",
  "priority": "high"
}
```

**Status values:** `pending`, `in_progress`, `completed`
**Priority values:** `low`, `medium`, `high`

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | JWT | List users (used by the task assignment picker) |

### Activity Logs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/activity-logs?page=1&limit=20` | JWT | Logs of all task actions (users see their own; admins see all) |

A **Postman workspace** is available at `postman/globals/workspace.globals.yaml` for importing the collection.

---

## Role-Based Access Control (RBAC)

- **JWT carries the role**: tokens are signed with `{ userId, role }`.
- **Two roles**: `admin` and `user` (seeded at startup).
- **Backend enforcement**:
  - `authenticate` middleware verifies the JWT.
  - `authorizeRoles("admin")` middleware gates admin-only routes declaratively.
  - `checkTaskAccess` ensures regular users can only modify their own tasks (admins can modify any).
- **Frontend reflection**:
  - Edit / Delete buttons are hidden unless the user owns the task or is an admin.
  - The header shows a role chip (`admin` highlighted in secondary color).
  - Hooks: `useIsAdmin()`, `useCurrentUser()`, `useCanModifyTask(createdById)`.

---

## Project Structure

```
Task-Manager/
├── tm-backend/                 # Express + Prisma + Mongoose API
│   ├── prisma/
│   │   ├── schema.prisma       # Role, User, Task models
│   │   └── migrations/
│   └── src/
│       ├── config/             # prisma + mongodb connections
│       ├── controllers/        # request handlers
│       ├── middleware/         # auth, role middleware
│       ├── models/             # Mongoose models (activity logs)
│       ├── routes/             # Express routers
│       ├── services/           # business logic
│       ├── seed/               # seed scripts (roles)
│       ├── utils/              # checkTaskAccess, logActivity
│       └── server.ts
├── tm-frontend/                # React + MUI + Redux Toolkit SPA
│   └── src/
│       ├── api/                # axios + endpoint wrappers
│       ├── components/         # reusable UI
│       ├── layouts/            # DashboardLayout (responsive)
│       ├── pages/              # Login, Register, Tasks, TaskDetail, TaskForm, ActivityLogs, NotFound
│       ├── routes/             # AppRoutes, ProtectedRoute
│       ├── store/              # Redux slices (auth, tasks, users, activityLogs)
│       └── theme.ts            # custom MUI theme
└── postman/                    # Postman workspace
```

---

## Deployment — Note on what's NOT done

The brief asked for:
- A **CI/CD pipeline** (e.g., GitHub Actions for lint, test, deploy)
- **Backend deployed on a Linux server using Nginx or Apache** 

Both items are **not implemented in this submission** because **a Linux server / VPS was not available** during the assignment window. Setting up CI/CD without a target server to deploy to would have only covered half the requirement and produced a misleading "green pipeline" with no real deployment target.

When a Linux VPS is available, the planned approach is:
- **Server**: Ubuntu 22.04 LTS on any VPS provider
- **Web server**: **Nginx** as a reverse proxy in front of the Node.js backend (PM2 to keep the process alive, or `systemd`)
- **HTTPS**: Let's Encrypt via Certbot
- **CI/CD**: GitHub Actions workflow with two jobs:
  1. On every PR — `lint`, `typecheck`, `test` (build verification)
  2. On `main` merge — SSH into the server, `git pull`, `npm ci`, `prisma migrate deploy`, `npm run build`, `pm2 restart`
- **Frontend**: Either built and served statically by the same Nginx, or deployed alongside the backend
- **Secrets**: Managed via GitHub Actions secrets (DB URLs, JWT secret, deploy SSH key)

Everything else from the brief is implemented and working locally.
