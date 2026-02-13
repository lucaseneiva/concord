<p align="center"> 
  <img width="1353" height="375" alt="Logo" src="https://github.com/user-attachments/assets/571e91bd-77dd-4faf-99bb-25c54671f61c" width="400"/>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-not%20accepting-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-000000?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-000000?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white" />
</div>

<br />

<div align="center">
  <strong>A modern, open-source team communication platform built for speed, clarity, and collaboration.</strong><br/>
  Real-time messaging, channels, and direct messages — all in one place.
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🪵 About

**BubingaChat** is a free and open-source team communicator designed for teams that value transparency, speed, and ownership of their data. Inspired by tools like Slack and Discord, BubingaChat gives you full control over your infrastructure — no subscriptions, no message limits, no vendor lock-in.

The name comes from *Bubinga*, a robust and resilient African hardwood — just like the communication foundation we want to provide for your team.

---

## ✨ Features

- 💬 **Real-time messaging** via WebSockets
- 📢 **Channels** — public and private workspaces for your teams
- 🔒 **Direct Messages** — one-on-one and group conversations
- 👤 **User authentication** — JWT-based secure login and registration
- 📎 **File & image sharing**
- 🔔 **Notifications** — mentions and activity alerts
- 🌙 **Dark mode** support
- 📱 **Responsive UI** — works on desktop and mobile browsers
- 🏢 **Workspace management** — create and manage multiple organizations
- 🔍 **Message search** across channels and DMs

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) |
| **Backend** | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Realtime** | [Socket.IO](https://socket.io/) |
| **Auth** | JWT (JSON Web Tokens) |
| **ORM** | [Prisma](https://www.prisma.io/) / [Knex.js](https://knexjs.org/) |
| **Styling** | CSS Modules / TailwindCSS |

---

## 🏗 Architecture

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x` or [Yarn](https://yarnpkg.com/) `>= 1.22`
- [PostgreSQL](https://www.postgresql.org/) `>= 14`
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-org/bubingachat.git
cd bubingachat
```

**2. Install backend dependencies**
```bash
cd server
npm install
```

**3. Install frontend dependencies**
```bash
cd ../client
npm install
```

### Environment Variables

**Backend** — create a `.env` inside `/server`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/bubingachat
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend** — create a `.env` inside `/client`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Running the App

```bash
# Run database migrations
cd server && npm run migrate

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm run dev
```

The app will be available at `http://localhost:3000`.

> To run both at once from the root, use `npm run dev` (requires [concurrently](https://www.npmjs.com/package/concurrently)).

---

## 📁 Project Structure

```
bubingachat/
├── client/                   # React.js frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── contexts/         # Auth, Socket, Theme contexts
│       ├── hooks/            # Custom hooks
│       ├── pages/            # Route-level components
│       ├── services/         # API and socket services
│       └── store/            # State management
│
├── server/                   # Node.js + Express.js backend
│   └── src/
│       ├── config/           # DB and env configs
│       ├── controllers/      # Route controllers
│       ├── middlewares/      # Auth, error handling
│       ├── models/           # Database models
│       ├── routes/           # Express routes
│       ├── services/         # Business logic
│       └── sockets/          # Socket.IO handlers
│
└── README.md
```

---
---

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

`feat:` · `fix:` · `docs:` · `style:` · `refactor:` · `test:` · `chore:`

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  Made with 💚 by the BubingaChat community<br/>
  <a href="https://github.com/your-org/bubingachat/issues">Report a Bug</a> · <a href="https://github.com/your-org/bubingachat/issues">Request a Feature</a>
</div>

---
