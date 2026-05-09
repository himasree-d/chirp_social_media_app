# Haven - Social Media Platform

Haven is a calm, premium-feeling social platform built with the MERN stack and Socket.io for real-time features. It focuses on a unique aesthetic (warm neutrals, moss green) and smooth user experiences.

## Features
- Secure JWT Authentication
- Personalized Feed (posts from followed users)
- Infinite Scrolling
- Image Uploads (Cloudinary)
- Real-time Notifications (Socket.io)
- Profile customization
- Follow system
- Public profiles via JSP

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017 or a URI)
- Cloudinary Account (for image uploads)

## Setup Instructions

### 1. Environment Variables
In the `backend` folder, copy `.env.example` to `.env` and fill in your details:
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env with your Cloudinary and JWT details
\`\`\`

### 2. Install Dependencies
Install dependencies for both frontend and backend:
\`\`\`bash
# From the root folder
npm install
\`\`\`

### 3. Run the Application
Start both the backend server and frontend development server concurrently:
\`\`\`bash
npm run dev
\`\`\`
- Frontend runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:5000/api`

### 4. JSP Public Profile
The `jsp` folder contains a standalone `public_profile.jsp` file. You can deploy this file to an Apache Tomcat server. It uses client-side JavaScript to fetch the public data from the Node.js API. 
Access it like: `http://localhost:8080/haven/public_profile.jsp?u=username`
