# ElevateNotes - Notes Management System

ElevateNotes is a modern, responsive, and visually stunning Full-Stack Notes Management System. Built using **React + Vite** and **Tailwind CSS** for the frontend, and **Node.js + Express + MongoDB** for the backend.

---

## Key Features

- 📝 **Create, Read, Update, Delete (CRUD) Notes**: Easily manage your thoughts and documentation.
- 🔍 **Global Real-Time Search**: Search through note titles, contents, categories, and tags instantly.
- 📁 **Smart Categories & Tags**: Assign categories and multiple tags to notes, with automatic counting and sorting.
- 🏷️ **Dynamic Sidebar Filtering**: Easily filter notes by category.
- 🚨 **Custom Toast System**: Beautiful inline animations and feedback indicators (no bulky libraries).
- 📱 **Fully Responsive Layout**: Designed to adapt perfectly to mobile, tablet, and desktop devices.
- 🛑 **Secure Modals**: Dialog-based viewing, forms, and delete warning guards.

---

## Technology Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (Utility-first styling with custom palette)
- **Axios** (HTTP client)
- **React Router DOM** (Single Page App routing)
- **Lucide React** (Premium minimal icon library)

### Backend
- **Node.js**
- **Express.js** (REST API)
- **Mongoose + MongoDB** (Data modeling & persistence)
- **CORS & dotenv** (Environment configurations and security)

---

## Directory Structure

```
notes-management-system/
├── backend/
│   ├── config/          # DB config helper
│   ├── controllers/     # Controller logic (CRUD, searches)
│   ├── models/          # Mongoose models (Note schema)
│   ├── routes/          # Express API route bindings
│   ├── .env             # Active environment file
│   ├── .env.example     # Configuration blueprint
│   └── server.js        # Main server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Navbar, Sidebar, NoteCard, etc.)
│   │   ├── pages/       # Page components (Dashboard)
│   │   ├── services/    # API calls wrapper (Axios)
│   │   ├── context/     # Custom contexts (ToastContext)
│   │   ├── App.jsx      # Routes setup
│   │   ├── index.css    # Tailwind base styles and custom animations
│   │   └── main.jsx     # Client bundle entrypoint
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## REST API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/notes` | Get all notes (supports `search` and `category` query filters) |
| **GET** | `/api/notes/:id` | Get details of a single note by ID |
| **POST** | `/api/notes` | Create a new note (requires `title` and `content`) |
| **PUT** | `/api/notes/:id` | Update details of a note by ID |
| **DELETE** | `/api/notes/:id`| Remove a note by ID |

---

## Setup & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally, or a MongoDB Atlas URI string)

### 1. Run the Backend API
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   copy .env.example .env
   ```
4. Set the `MONGODB_URI` environment variable if you are using Atlas. Default is set to connect to local database `mongodb://localhost:27017/notes-db`.
5. Start the development server (uses `nodemon` for auto-reloading):
   ```bash
   npm run dev
   ```
   *The server runs by default on port `5000` (`http://localhost:5000`).*

### 2. Run the Frontend Client
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
   *The development server will launch on port `3000` (`http://localhost:3000`). The Vite configuration includes an automatic proxy mapping all `/api/*` calls directly to the port `5000` server.*

---

## Production Deployment Instructions

### Database (MongoDB Atlas)
1. Register or Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster.
3. Add a database user with password credentials.
4. Set up Network Access to allow access from anywhere (`0.0.0.0/0`) since cloud deployment IPs dynamically shift.
5. Copy your connection URL: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/notes-db?retryWrites=true&w=majority`.

### Backend (Render)
1. Connect your GitHub account to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Choose your repository.
4. Configure the environment settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add the environment variables:
   - `PORT`: `5000` (or leave it to Render's default)
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Use the generated URL for the frontend.

### Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com/) and link your GitHub.
2. Select **Add New** -> **Project** -> Import your repository.
3. Configure the Root Directory settings:
   - Choose **`frontend`** as the Root Directory.
4. In the **Build and Development Settings**:
   - Vercel automatically detects Vite framework. Keep the default settings.
5. Create a `vercel.json` config file in your frontend root if you need custom URL redirects for SPA routing:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://<your-render-backend-url>/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**. Your frontend is online!
