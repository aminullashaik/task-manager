======================================================
JBS - Enterprise Task Manager (MERN Full-Stack)
======================================================

An enterprise-grade team task management platform featuring a custom glassmorphism dark-mode UI, collaborative task locking, work entry logging, and real-time metrics.

------------------------------------------------------
1. TECH STACK & TOOLS USED
------------------------------------------------------
* Frontend:
  - React.js (Vite)
  - Vanilla CSS (Bespoke glassmorphism & responsive layouts)
  - Lucide React (SVG icon library)
  - Axios (HTTP client with JWT authorization interceptors)
  - React Router DOM (Single Page Application routing)

* Backend:
  - Node.js & Express.js (REST API Server)
  - MongoDB & Mongoose (NoSQL database & schema modeling)
  - JSON Web Tokens (JWT) (State-less authorization)
  - Bcrypt.js (Secure password hashing)

------------------------------------------------------
2. KEY FEATURES
------------------------------------------------------
* Collaborative Locking (Concurrency Control):
  - Members lock tasks before working on them to prevent conflicts.
  - Active locks show who is working on the task and prevent others from editing it.
  - Unlocking resets the task status back to pending.

* Task & Project Management:
  - Admins can create projects and assign multiple members to individual tasks.
  - Double-tab filtering ("My Tasks" and "All Tasks") for custom developer workspaces.
  - Embedded work logs track contributor names, dates, and hours spent on a task.

* Secure Authentication & Roles:
  - Password hashing and stateless JWT-based session security.
  - Role-based views: Admin (create/manage), Member (lock/log), Client (read-only viewer).
  - Streamlined Toast alerts for cleaner, layout-shift-free feedback.

* Real-Time Analytics Dashboard:
  - Live charts showing counts of total tasks, completed, and overdue status.

------------------------------------------------------
3. HOW TO RUN THE PROJECT LOCALLY
------------------------------------------------------
* Prerequisites:
  - Node.js (v18+)
  - MongoDB instance (Atlas or local)

* Backend Configuration:
  1. Navigate to the backend directory:
     cd backend
  2. Create a '.env' file:
     PORT=5005
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
  3. Install dependencies & start server:
     npm install
     npm start

* Frontend Configuration:
  1. Navigate to the frontend directory:
     cd frontend
  2. Install dependencies & start dev server:
     npm install
     npm run dev
  3. View in browser at: http://localhost:5173

------------------------------------------------------
4. DEPLOYMENT LINKS
------------------------------------------------------
* Live Application URL: https://task-manager-production-2257.up.railway.app
* Backend API Endpoint: https://task-manager-production-852a.up.railway.app
* GitHub Repository: https://github.com/aminullashaik/task-manager

------------------------------------------------------
Developed by Shaik Aminulla

