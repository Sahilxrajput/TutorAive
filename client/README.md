# TutorAive — Client

React SPA frontend for **TutorAive**, an online tutoring platform. Provides the UI for classrooms, live video/audio sessions, notes, assignments, community feed, and payments. Part of a monorepo with the Node.js backend; deployed on **Vercel**.

---

## 1. Project Overview

The client is a single-page application that:

- **Authenticates** users (email/password and Google OAuth) and keeps session via JWT (access token in `localStorage`, refresh via cookie).
- **Classrooms**: browse, view, join by invite code or payment; instructor dashboard, assignments, roster, invitations, live session launch.
- **Live sessions**: real-time video/audio via **mediasoup-client** and **Socket.IO** (chat, Q&A, polls) with instructor/student views.
- **Notes**: rich editor (Tiptap), create/edit, pin/archive/trash, collaborators, search.
- **Community**: tweet-style feed (create, like, repost), with TanStack Query.
- **Quiz**: AI-generated quizzes.
- **Payments**: Razorpay integration for course enrollment.
- **Notifications**: real-time sidebar and optional toast updates via Socket.IO.

The app uses **Vite** for build and dev, **React Router 7** for routes, **TanStack Query** for server state, and **React Context** for auth and socket.

---

## 2. Major Features

| Feature | Description |
|--------|-------------|
| **Landing & marketing** | Landing page, hero, how it works, testimonials, contact, teacher/student pages, launch classroom CTA |
| **Auth** | Sign up, sign in, Google OAuth, auth success redirect, protected routes, role-based UI (instructor/student) |
| **Home** | Dashboard-style home with course cards, lecture list, day schedule, badges |
| **Classrooms** | Browse classrooms, view single classroom (enrolled only via `EnrolledRoute`), sidebar (assignments, roster, chat, Q&A, polls, broadcast), invitations, archive sector |
| **Live session** | Instructor: start class, video stage, controls; student: join live, video stage, control bar; mediasoup WebRTC + Socket.IO chat/Q&A/polls |
| **Assignments** | Assignment cards, submission flow, PDF upload dialog, grading (instructor) |
| **Notes** | Browse by status, create/edit note (Tiptap), note cards, grid, actions (pin, archive, trash, share), search, collaborators |
| **Community** | Tweet feed, create tweet (with image), like, repost, filters, author info |
| **Quiz** | Quiz page with AI-generated questions |
| **Payments** | Classroom payment / Razorpay (e.g. enrollment) |
| **Notifications** | Notification sidebar, real-time updates via socket, unread count |
| **Layout** | Global sidebar, mobile navbar, theme toggle (dark/light), hide sidebar shortcut |
| **Join by invite** | Join classroom by link `classrooms/:classroomId/join/:inviteCode` |

---

## 3. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Build / dev** | Vite 7 |
| **Language** | TypeScript |
| **Routing** | React Router 7 |
| **Styling** | Tailwind CSS 4, SCSS (variables, keyframes, component styles) |
| **UI primitives** | Radix UI (Dialog, Dropdown, Tabs, Avatar, etc.), Floating UI |
| **Components** | Custom UI layer (`ui/`), Tiptap primitives, class-variance-authority, tailwind-merge, clsx |
| **Animations** | Framer Motion, GSAP |
| **Icons** | Lucide React |
| **Data / server state** | TanStack Query (React Query) v5 |
| **Auth / global state** | React Context (Auth, Socket, Search, Classroom) |
| **HTTP client** | Axios (centralized in `lib/api.ts`, interceptors for token and refresh) |
| **Real-time** | Socket.IO Client, mediasoup-client (WebRTC) |
| **Rich text editor** | Tiptap (Starter Kit + extensions: lists, image, highlight, text-align, etc.) |
| **Forms / dates** | react-day-picker, Radix form primitives |
| **Toast** | Sonner |
| **Analytics** | Vercel Analytics |
| **Theme** | next-themes (dark/light) |

---

## 4. Folder Structure

```
client/
├── public/                 # Static assets (images, sitemap, 404)
├── src/
│   ├── api/                # API module wrappers (lectures, notes, tweets)
│   ├── assets/            # Images and static assets used in src
│   ├── components/        # Reusable and feature components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom hooks (auth, socket, classroom, UI, editor)
│   ├── lib/               # Core utilities
│   ├── menu/             # Config for menus (e.g. note menu)
│   ├── pages/            # Route-level pages
│   ├── services/         # Domain services (e.g. tweetService)
│   ├── styles/          # Global SCSS (_variables, _keyframe-animations)
│   ├── tanStack/        # TanStack Query
│   ├── types/           # TypeScript types (type.ts)
│   ├── utils/           # Helpers (cn, notifyError, parseQuizData, etc.)
│   ├── wrapper/         # Route wrappers
│   ├── App.tsx          # Routes and lazy-loaded pages
│   ├── main.tsx         # Root render, providers (Query, Auth, Router, Search, Socket, Toaster)
│   └── index.css       # Global styles
├── .env.example
├── components.json      # Tooling config (e.g. shadcn)
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── vercel.json          # SPA rewrite for Vercel
└── generate-sitemap.js  # Optional sitemap script
```
---

## 5. Environment Variables

Create a `.env` file in `client/` (use `.env.example` as a template). Vite only exposes variables prefixed with `VITE_`.

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000` or `https://your-api.onrender.com`) | Yes |
| `VITE_SOCKET_URL` | Socket.IO server URL (usually same host as API, e.g. `http://localhost:3000`) | Yes |

Optional (if you use them in code):

| Variable | Description |
|----------|-------------|
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for client-side payment UI (referenced in `ClassroomPayment.tsx`; may be commented out) |

Example `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

For production, set these in Vercel (or your host) to the deployed API and Socket URLs.

---

## 6. Setup Instructions

### Prerequisites

- **Node.js** 18+
- Backend server running (see `server/README.md`) if you need API and Socket.

### Steps

1. **Clone and go to client**

   ```bash
   git clone https://github.com/Sahilxrajput/TutorAive
   cd TutorAive/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment**

   Copy `.env.example` to `.env` and set:

   - `VITE_API_URL` — e.g. `http://localhost:3000`
   - `VITE_SOCKET_URL` — e.g. `http://localhost:3000`

4. **Run**

   ```bash
   # Development
   npm run dev
   ```

   Default dev server: **http://localhost:5173**

   ```bash
   # Production build
   npm run build

   # Preview production build locally
   npm run preview
   ```

   Other scripts:

   - `npm run typecheck` — TypeScript check
   - `npm run lint` — ESLint

---
<!-- 
## 7. Deployment on Vercel

1. **Connect repo**  
   In [Vercel](https://vercel.com), import the repository (e.g. GitHub). Select the **root** of the monorepo.

2. **Configure project**  
   - **Root Directory:** set to `client` (so Vercel builds the frontend only).  
   - **Framework Preset:** Vite (auto-detected if present).  
   - **Build Command:** `npm run build` (default).  
   - **Output Directory:** `dist` (Vite default).  
   - **Install Command:** `npm install` (default).

3. **Environment variables**  
   In the Vercel project → Settings → Environment Variables, add:

   - `VITE_API_URL` — production API URL (e.g. `https://your-app.onrender.com`)
   - `VITE_SOCKET_URL` — production Socket.IO URL (same as API if served from same host)

   Use the same values for Production, Preview, and Development if you want consistency.

4. **SPA routing**  
   The repo includes `vercel.json` with a rewrite so all routes serve `index.html`:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

   This is correct for React Router client-side routing. No extra config needed.

5. **Deploy**  
   Push to the connected branch or trigger a deploy from the Vercel dashboard. The client will be built and served from Vercel; ensure the backend allows the Vercel origin in CORS (`CLIENT_URL` on the server).

--- -->

## 7. Scripts Summary

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run lint` | Run ESLint |

---

## 8. Monorepo Note

This app is the **client** of the TutorAive monorepo. The **server** lives in `../server` and is documented in `../server/README.md`. For full local setup (client + server + env), see the root `../readme.md`.
