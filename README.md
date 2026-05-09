<div align="center">
  <!-- You can replace this with an actual logo or banner image -->
  <img src="https://via.placeholder.com/800x200?text=Chirp+Social+Platform" alt="Chirp Banner" />

  <h1>Chirp - Social Media Platform</h1>
  <p>A premium, real-time social platform built with the MERN stack and Socket.io. Designed with a calming aesthetic and smooth user experiences.</p>
</div>

---

## 📸 Showcase / Screenshots

*Add screenshots of your application here to show off your UI! Replace the placeholder links with your actual image paths.*

| Login & Authentication | The Main Feed |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Login+Page" alt="Login Screenshot" /> | <img src="https://via.placeholder.com/400x250?text=Main+Feed" alt="Feed Screenshot" /> |

| Real-time Notifications | User Profile & Customization |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Notifications" alt="Notifications" /> | <img src="https://via.placeholder.com/400x250?text=User+Profile" alt="Profile" /> |

---

## ✨ Features

- **🔐 Secure Authentication**: Robust JWT-based user login, registration, and session management.
- **📰 Personalized Feed**: Algorithm-free feed showing posts exclusively from users you follow.
- **⚡ Real-time Interactions**: Live notifications, instant messaging, and real-time feed updates powered by Socket.io.
- **🖼️ Media Uploads**: Seamless and optimized image uploads managed securely via Cloudinary.
- **💬 Interactive Posts**: Engage with content by liking, commenting, and saving posts to your personal collection.
- **👤 Profile Customization**: Edit your avatar, update your bio, and manage your followers/following lists.
- **📱 Responsive Design**: Fully responsive, mobile-first design built with Tailwind CSS, ensuring smooth scaling across all devices.
- **🎨 Premium UI/UX**: Fluid animations (Framer Motion) and a carefully crafted color palette (warm neutrals, moss green).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Data Fetching**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Real-time Engine**: Socket.io
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Media Storage**: Cloudinary (via Multer)

---

## 🚀 Local Setup Instructions

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (running locally on port `27017` or a MongoDB Atlas URI)
- **Cloudinary Account** (Create a free account to handle image uploads)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/himasree-d/chirp_social_media_app.git
cd chirp_social_media_app
\`\`\`

### 2. Install Dependencies
The project uses a root `package.json` to manage both the client and server. Run this from the root directory to install everything at once:
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
You will need to set up environment variables for the backend. Navigate to the `server` directory and create a `.env` file:
\`\`\`bash
cd server
touch .env
\`\`\`

Open the `server/.env` file and add the following keys. Make sure to replace the placeholder values with your actual credentials:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port the backend server runs on | `5005` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb://127.0.0.1:27017/Chirp` |
| `JWT_SECRET` | A secure random string for signing tokens | `your_super_secret_jwt_key_here` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name | `dxxxxxx` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret | `abC_defGHIJklmnop` |

### 4. Run the Application
You can start both the React frontend and the Express backend simultaneously from the **root directory**.

Open a terminal in the root `chirp_social_media_app` folder and run:
\`\`\`bash
npm run dev
\`\`\`

This single command will spin up:
- **Frontend Development Server**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5005/api`

---

## 📁 Project Structure

\`\`\`text
chirp_social_media_app/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios instance and API calls
│   │   ├── components/     # Reusable UI components (Feed, Layout, UI)
│   │   ├── context/        # React Context (Auth, Notifications)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Full page views (Home, Profile, Login)
│   │   └── styles/         # Global CSS and Tailwind config
├── server/                 # Node/Express Backend
│   ├── controllers/        # Route logic and business rules
│   ├── middleware/         # Auth verification, Multer upload config
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # Express API routes
│   └── server.js           # Express app & Socket.io initialization
├── jsp/                    # Legacy Java Server Page (public profile)
└── package.json            # Root configuration and concurrent scripts
\`\`\`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/himasree-d/chirp_social_media_app/issues).
