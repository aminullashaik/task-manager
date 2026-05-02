Project Name: Nexus - Team Task Manager (Full-Stack)

Description:
A comprehensive Team Task Manager built with the MERN stack (MongoDB, Express, React, Node.js). 
It features a high-quality glassmorphism UI design, role-based access control (Admin/Member), 
and seamless task management capabilities.

Key Features:
- Professional Intro/Landing Page
- Authentication (Signup/Login with JWT)
- Project & team management (Create projects, assign members)
- Task creation, assignment & status tracking
- Dynamic Dashboard (total, completed, overdue tasks)
- Role-based access control (Admins can create projects/tasks, members can update task status)
- Beautiful, premium Vanilla CSS UI (No TailwindCSS, custom glassmorphism design system)
- Fully responsive layout with smooth micro-animations

Tech Stack:
- Frontend: React.js, Vite, Vanilla CSS, Lucide React (Icons), Axios, React Router Dom
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

Instructions to Run Locally:
1. Backend:
   - cd backend
   - npm install
   - Ensure MongoDB is running and update MONGO_URI in .env if necessary
   - npm start (runs on port 5000)

2. Frontend:
   - cd frontend
   - npm install
   - npm run dev (runs on port 5173)

Deployment (Railway):
To deploy this application to Railway:
1. Create a GitHub repository and push this entire folder.
2. Sign in to Railway and create a new project.
3. Choose "Deploy from GitHub repo" and select your repository.
4. Add the necessary Environment Variables (MONGO_URI, JWT_SECRET) in Railway settings.
5. Railway will automatically detect and build the Node.js backend.
6. For the frontend, you can deploy it on Vercel or Railway by pointing the root directory to `frontend` and using the build command `npm run build`.

Submission Links:
- Live URL: [INSERT YOUR DEPLOYED URL HERE]
- GitHub Repository Link: [INSERT YOUR GITHUB URL HERE]
- Demo Video: [INSERT YOUR VIDEO URL HERE]
