Project Name: JBS - Enterprise Task Manager (Full-Stack)

Description:
JBS is a premium, high-performance team task management system engineered using the MERN stack. 
Unlike standard template-driven applications, this platform was built with a highly custom, handcrafted design system. Every single panel, input field, and interaction was designed using bespoke Vanilla CSS (without relying on Tailwind or external UI component libraries) to create an ultra-modern, glassmorphism dark-mode interface. 

The application is packed with fluid CSS micro-animations, spring-effect hovers, and clean component structures designed to offer an incredibly responsive, premium user experience. On the engineering side, it implements highly robust database schemas, secure authorization layers, and a dynamic lock-based collaborative workflow.

Key Features:
- Bespoke Glassmorphism Landing Page & User Interface
- Secure Authentication (Signup/Login with JWT & automatic email completion)
- Project and team management (Create projects, assign members)
- Multi-User Task Assignment (Assign tasks to multiple team members simultaneously)
- Task Locking System (Lock tasks before working on them to prevent concurrent conflicts)
- Live Work Entry Logging (Log Date and Time spent on active tasks securely)
- Dynamic Dashboard (Real-time counts for total, completed, working, locked, and overdue tasks)
- Role-based access control (Admins manage, members lock and log work entries)
- Hand-coded Vanilla CSS Layouts (Zero Tailwind or bootstrap imports)
- Fully responsive layout with customized CSS keyframe micro-animations

Tech Stack:
- Frontend: React.js, Vite, Vanilla CSS, Lucide Icons, Axios
- Backend: Node.js, Express.js (v5), MongoDB Atlas, Mongoose, JWT, Bcrypt

===============================
TECHNICAL ARCHITECTURE & DESIGN
===============================

1. Database Structure Design (Mongoose)
--------------------------------------
- User Schema: Represents users with name, email, password, and role ('admin', 'member', 'client').
- Task Schema:
  * title: String (Required)
  * description: String
  * projectId: Schema.Types.ObjectId (Ref: 'Project')
  * assignedTo: [Schema.Types.ObjectId] (Ref: 'User', Supports multiple team members)
  * status: String (default: 'pending', updates to 'working' on lock, 'done' on complete)
  * dueDate: Date
  * isLocked: Boolean (default: false)
  * lockedBy: Schema.Types.ObjectId (Ref: 'User', default: null)
  * workEntries: Array of objects containing:
    - date: String (Required)
    - time: String (Required)
    - userName: String (Required, auto-populated securely by server session)

2. Core Backend APIs
-------------------
- GET /tasks/my-tasks: Retrieves only the tasks assigned to the currently logged-in user.
- POST /tasks: Admin creates a task and assigns it to multiple user IDs.
- PATCH /tasks/:id/lock: Locks a task for the authenticated user and sets status to 'working'. Prevents other users from locking or working on it.
- PATCH /tasks/:id/unlock: Releases the task lock back to 'pending' state.
- POST /tasks/:id/work-entry: Appends a work log (Date, Time, and userName securely fetched from active DB user session).
- PATCH /tasks/:id/complete: Marks status as 'done', resets lock to false, and releases the locking user.

3. Frontend UI Screens & Workflows
---------------------------------
- Team Task Creation & Assignment:
  * Modal provides a checkbox-based multi-select grid to select and assign multiple users to a task.
- Dynamic Task List Screen:
  * Standardized "My Tasks" and "All Tasks" tabs to partition viewable items based on user context.
  * Interactive avatar initials stack representing all assigned team members.
- Task Working Panel (Dynamic Card Expansion):
  * Shows "Lock Task" button for assignees.
  * If locked by current user, shows the active "Log Work Entry" form (Date, Time spent) and a green "Complete" button.
  * Displays a collapsible "Show Work Logs" section showing chronological entries with names, dates, and times.

4. Frontend and Backend Interaction (Data Flow)
----------------------------------------------
- Auth: React saves JWT token on successful login. Axios interceptor automatically attaches 'Bearer <Token>' to all HTTP Authorization headers.
- Lock Flow: User clicks "Lock". Frontend sends PATCH to /tasks/:id/lock. Express verifies token, updates Mongo document, and returns updated Task. State updates in React to unlock the form.
- Work Log Flow: User enters Date & Time, submits. Frontend sends POST to /tasks/:id/work-entry. Express extracts userID from JWT, fetches Name from User Collection, appends log to array, and sends back updated data.

Instructions to Run Locally:
1. Backend Setup:
   - cd backend
   - npm install
   - Configure MONGO_URI and JWT_SECRET in .env
   - npm start (runs on dynamic port, defaults to 5005)

2. Frontend Setup:
   - cd frontend
   - npm install
   - npm run dev (runs on port 5173)

Deployment Links:
- Live URL: https://task-manager-production-2257.up.railway.app
- GitHub Repository Link: https://github.com/aminullashaik/task-manager
- Backend API Link: https://task-manager-production-852a.up.railway.app

Note: Developed by Shaik Aminulla
