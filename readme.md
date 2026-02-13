# TutorAive

A full-stack online tutoring platform with live classrooms, real-time video/audio, assignments, notes, and payments.

---

## Project overview

**TutorAive** is a monorepo containing:

| Package   | Description                                      | Deployed on |
|----------|---------------------------------------------------|-------------|
| **client** | React SPA — classrooms, live sessions, notes, Q&A, payments | [Vercel](https://vercel.com) |
| **server** | Node.js API — auth, classrooms, mediasoup, Socket.IO, payments | [Render](https://render.com) |

---

### Core Features
- Live video/audio classrooms using mediasoup
- Real-time chat and Q&A via Socket.IO
- Assignments and submissions
- Rich text notes with Tiptap
- Google OAuth authentication
- Razorpay payment integration

---


## Tech stack

### Client

| Category      | Technologies |
|---------------|--------------|
| Framework     | React 19, Vite 7 |
| UI            | Tailwind CSS 4, Radix UI, Framer Motion, Lucide |
| Data & state  | TanStack Query, React Context |
| Real-time     | Socket.IO Client, mediasoup-client |
| Editor        | Tiptap |
| Routing       | React Router 7 |

### Server

| Category      | Technologies |
|---------------|--------------|
| Runtime       | Node.js |
| Framework     | Express 5 |
| Database      | MongoDB (Mongoose) |
| Auth          | Passport (Google OAuth), JWT, cookie-session |
| Real-time     | Socket.IO, mediasoup |
| Jobs          | BullMQ, Redis |
| Payments      | Razorpay |
| Storage       | Cloudinary |
| AI / search   | LangChain, Pinecone, Google GenAI |

---

## Folder structure

```
TutorAive/
├── client/                 # React app (Vercel)
├── server/                 # Node.js API (Render)
└── readme.md
```

---

## Local setup

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Redis** (for BullMQ)

### 1. Clone and install

```bash
git clone https://github.com/Sahilxrajput/TutorAive
cd TutorAive
```

```bash
# Install client dependencies
cd client && npm install 

# Install server dependencies
cd server && npm install 
```

### 2. Environment variables

**Client** (`client/.env`):

- `VITE_API_URL` — base URL of the server (e.g. `http://localhost:3000`)

**Server** (`server/.env`):

- `PORT` — server port (default `3000`)
- `MONGODB_URI` — MongoDB connection string
- `CLIENT_URL` — frontend origin for CORS (e.g. `http://localhost:5173`)
- `SESSION_SECRET` — cookie/session secret
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
<!-- - Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` -->
- Cloudinary (if used): `CLOUDINARY_*`
- Redis (for BullMQ): `REDIS_URL` or equivalent
- Optional: Pinecone / Google GenAI keys if using AI features

### 3. Run locally

**Terminal 1 — server**

```bash
cd server
npm run dev
```

**Terminal 2 — client**

```bash
cd client
npm run dev
```

- Client: usually **http://localhost:5173**
- Server: **http://localhost:3000** (or your `PORT`)

---

## Deployment

| App    | Platform | Link |
|--------|----------|------|
| **Client** | Vercel   | https://tutoraive.vercel.app |
| **Server** | Render   | https://tutoraive.onrender.com |

---

## Scripts

| Location | Command        | Description        |
|----------|----------------|--------------------|
| client   | `npm run dev`  | Start Vite dev server |
| client   | `npm run build`| Production build   |
| client   | `npm run preview` | Preview production build |
| server   | `npm run dev`  | Run with tsx watch |
| server   | `npm run build`| Compile TypeScript |
| server   | `npm start`    | Run compiled `dist/app.js` |

---