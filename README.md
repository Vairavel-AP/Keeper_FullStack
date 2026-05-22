# 📝 Keeper App — Full Stack

A full-stack Google Keep-inspired note-taking app with **Authentication** and **PostgreSQL** database.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat)
![Google](https://img.shields.io/badge/Google-OAuth2-4285F4?style=flat&logo=google)

---

## ✨ Features

- 🔐 **Email & Password** registration and login
- 🔵 **Google Sign-In** via OAuth 2.0
- 🗄️ **PostgreSQL** database — notes saved permanently per user
- 🔑 **JWT** token-based authentication
- 📝 **Create** notes with title and content
- 🗑️ **Delete** notes
- 🎞️ **Expand animation** on note input
- 👤 **User avatar** and name shown in header
- 🚪 **Logout** button
- 🛡️ Protected routes — only logged-in users see notes

---

## 🗂️ Project Structure

```
keeper-fullstack/
├── client/               # React frontend
│   ├── public/styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── index.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── components/
│           ├── App.jsx        # Routes
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Home.jsx
│           ├── Header.jsx
│           ├── Footer.jsx
│           ├── CreateArea.jsx
│           └── Note.jsx
│
└── server/               # Node.js backend
    ├── index.js           # Express entry
    ├── db.js              # PostgreSQL + schema
    ├── .env.example
    ├── middleware/
    │   └── auth.js        # JWT verification
    └── routes/
        ├── auth.js        # Register, Login, Google
        └── notes.js       # CRUD notes
```

---

## 🚀 Getting Started

### 1. PostgreSQL Setup

Make sure PostgreSQL is installed and running, then create the database:

```sql
CREATE DATABASE keeper_db;
```

### 2. Server Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=keeper_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_long_random_string
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the client:

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔑 Getting Google Client ID

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set **Authorized JavaScript origins**: `http://localhost:5173`
6. Set **Authorized redirect URIs**: `http://localhost:5173`
7. Copy the **Client ID** into both `.env` files

---

## 📡 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register with email |
| POST | `/api/auth/login` | ❌ | Login with email |
| POST | `/api/auth/google` | ❌ | Google Sign-In |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/notes` | ✅ | Get all notes |
| POST | `/api/notes` | ✅ | Create a note |
| PUT | `/api/notes/:id` | ✅ | Update a note |
| DELETE | `/api/notes/:id` | ✅ | Delete a note |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| UI | Material UI v5, Google Fonts |
| Auth (client) | @react-oauth/google, JWT in localStorage |
| Backend | Node.js, Express |
| Database | PostgreSQL (via `pg`) |
| Auth (server) | bcrypt, jsonwebtoken, google-auth-library |
