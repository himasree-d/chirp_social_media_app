# Chirp - Social Media Platform

Chirp is a premium, real-time social platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It focuses on a clean aesthetic (warm neutrals, moss green) and smooth user experiences.

## Features
- **Secure Authentication**: JWT-based user login and registration.
- **Personalized Feed**: View posts exclusively from users you follow.
- **Real-time Interactions**: Live notifications and instant updates via Socket.io.
- **Media Uploads**: Seamless image uploads powered by Cloudinary.
- **Interactive Posts**: Like, comment, and save posts to your profile.
- **Profile Customization**: Edit your avatar, bio, and manage your followers/following.
- **Responsive Design**: fully optimized for desktop and mobile devices.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Media Storage**: Cloudinary

## Prerequisites
To run this project locally, you will need:
- Node.js (v18+)
- MongoDB (running locally on port `27017` or an external MongoDB Atlas cluster)
- Cloudinary Account (for handling image uploads)

## Local Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/himasree-d/chirp_social_media_app
cd chirp_social_media_app
\`\`\`

### 2. Install Dependencies
The project is structured with a root `package.json` that handles installing both frontend and backend dependencies at once.
Run this from the **root directory**:
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
You need to configure the backend environment variables. Navigate to the `server` directory and create a `.env` file:
\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Inside the `server/.env` file, ensure the following variables are set:
\`\`\`env
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/Chirp
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
\`\`\`

### 4. Run the Application
You can start both the React frontend and the Express backend simultaneously from the **root directory**:
\`\`\`bash
# Run this from the root 'Chirp' directory
npm run dev
\`\`\`

This single command will spin up:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5005/api`

## Project Structure
- `/client` - Contains the React/Vite frontend application.
- `/server` - Contains the Node.js/Express backend API and MongoDB models.
- `/jsp` - Contains a legacy Java Server Page (`public_profile.jsp`) for public profile viewing.
