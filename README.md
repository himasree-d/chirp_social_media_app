<div align="center">
  <img width="164" height="53" alt="image" src="https://github.com/user-attachments/assets/51e8be26-6287-471e-be15-2312832d49a4" />

  <h1>Chirp - Social Media Platform</h1>
  <p>A premium, real-time social platform built with the MERN stack and Socket.io. Designed with a calming aesthetic and smooth user experiences.</p>
</div>

---

## 📸 Showcase / Screenshots

<table>
  <tr>
    <td align="center"><b>Login Page</b><br/><img src="https://github.com/user-attachments/assets/1a3729b8-382f-4e0b-aff3-d611510c907f" width="480"/></td>
    <td align="center"><b>Main Feed</b><br/><img src="https://github.com/user-attachments/assets/c3a6258e-05ec-424b-a6a7-de3c32df2920" width="480"/></td>
  </tr>
  <tr>
    <td align="center"><b>Notifications</b><br/><img src="https://github.com/user-attachments/assets/dff227b4-65f3-4518-aa22-b4308685b884" width="480"/></td>
    <td align="center"><b>User Profile</b><br/><img src="https://github.com/user-attachments/assets/c6713885-e4a1-4ac7-8cf3-d31a95d6979b" width="480"/></td>
  </tr>
  <tr>
    <td align="center"><b>Creating a Post</b><br/><img src="https://github.com/user-attachments/assets/95946544-62d4-485c-af67-17608ca56c6a" width="480"/></td>
    <td align="center"><b>Dark Mode</b><br/><img src="https://github.com/user-attachments/assets/aa1cb9b3-4f56-4fcf-892b-8c1ac63aa273" width="480"/></td>
  </tr>
</table>




---

##  Features

- ** Secure Authentication**: Robust JWT-based user login, registration, and session management.
- ** Personalized Feed**: Algorithm-free feed showing posts exclusively from users you follow.
- ** Real-time Interactions**: Live notifications, instant messaging, and real-time feed updates powered by Socket.io.
- ** Media Uploads**: Seamless and optimized image uploads managed securely via Cloudinary.
- ** Interactive Posts**: Engage with content by liking, commenting, and saving posts to your personal collection.
- ** Profile Customization**: Edit your avatar, update your bio, and manage your followers/following lists.
- ** Responsive Design**: Fully responsive, mobile-first design built with Tailwind CSS, ensuring smooth scaling across all devices.
- ** Premium UI/UX**: Fluid animations (Framer Motion) and a carefully crafted color palette (warm neutrals, moss green).

---

##  Tech Stack

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

##  Local Setup Instructions

> Get a local copy up and running in just a few steps.

###  Prerequisites

Make sure you have the following installed/ready before starting:

| Tool | Requirement |
| :--- | :--- |
| **Node.js** | v18.0.0 or higher |
| **MongoDB** | Running locally on port `27017`, or a MongoDB Atlas URI |
| **Cloudinary Account** | Free account at [cloudinary.com](https://cloudinary.com) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/himasree-d/chirp_social_media_app.git
cd chirp_social_media_app
```

### Step 2 — Install Dependencies

The root `package.json` manages both client and server. One command installs everything:

```bash
npm install
```

### Step 3 — Configure Environment Variables

Navigate to the `server` directory and create a `.env` file:

```bash
cd server && touch .env
```

Then open `server/.env` and fill in your credentials:

```env
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/Chirp
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

>  You can find your Cloudinary credentials in your [Cloudinary Dashboard](https://cloudinary.com/console).

### Step 4 — Run the App

From the **root directory**, run:

```bash
npm run dev
```

This starts both servers simultaneously:

| Service | URL |
| :--- | :--- |
|  Frontend | `http://localhost:5173` |
|  Backend API | `http://localhost:5005/api` |

## 📁 Project Structure

```
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
```

---

