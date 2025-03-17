Deploy-App: My-App

A full-stack web application for creating, viewing, and searching posts (memories) with pagination and tag-based filtering.

App Screenshot:

Table of Contents

Features
Tech Stack
Installation
Usage
Deployment
API Endpoints
Contributing
License
Features

Create Posts: Add new posts with titles, messages, tags, and images.
View Posts: Display posts in a responsive grid layout.
Search Posts: Filter posts by search terms and tags.
Pagination: Navigate through posts with a paginated interface (10 posts per page).
Edit/Delete: Update or remove existing posts.
Like Posts: Interact with posts by liking them.
Responsive Design: Works on desktop and mobile devices.
Tech Stack

Frontend:
React.js
Redux (state management)
Material-UI (styling and components)
React Router (navigation)
Backend:
Node.js with Express.js
MongoDB (via Mongoose for data storage)
Deployment:
Frontend: Netlify (e.g., https://note-memo.netlify.app/)
Backend: Render (e.g., https://note-backend-d8d4.onrender.com/)
Installation
To run this app locally, follow these steps:

Prerequisites

Node.js (v14 or higher)
npm or yarn
MongoDB (local instance or MongoDB Atlas)
Clone the Repository
git clone https://github.com/your-username/deploy-app.git
cd deploy-app/my-app

Backend Setup

Navigate to the backend directory (if separate): cd backend
Install dependencies: npm install
Create a .env file in the backend directory: PORT=5000 MONGODB_URL=mongodb://localhost:27017/my-app-db # or your MongoDB Atlas URI
Start the backend: npm start
Frontend Setup

Navigate to the frontend directory: cd frontend
Install dependencies: npm install
Create a .env file in the frontend directory: REACT_APP_API_URL=https://note-backend-d8d4.onrender.com # or http://localhost:5000 for local dev
Start the frontend: npm start
Opens at http://localhost:3000 by default.
Usage

Home Page: View all posts with pagination at /posts.
Search: Use the search bar and tags to filter posts (e.g., /posts/search?searchQuery=test&tags=tag1,tag2).
Create/Edit: Use the form to add or update posts.
Interact: Like or delete posts as needed.
Example Commands

Fetch all posts for page 2: curl "http://localhost:5000/posts?page=2"
Search posts: curl "http://localhost:5000/posts/search?searchQuery=test&tags=fun"
Deployment

Frontend: Deployed on Netlify
URL: https://note-memo.netlify.app/
Steps:
Push code to GitHub.
Connect repo to Netlify.
Set build command: npm run build.
Set publish directory: build.
Backend: Deployed on Render
URL: https://note-backend-d8d4.onrender.com/
Steps:
Push backend code to GitHub.
Create a new web service on Render.
Set environment variables (e.g., MONGODB_URL).
Deploy with npm start.
API Endpoints

GET /posts?page=<number>: Fetch paginated posts.
Response: { posts: [], currentPage, totalPages, totalPosts }
GET /posts/search?searchQuery=<term>&tags=<comma-separated>: Search posts.
Response: { posts: [], currentPage, totalPages, totalPosts }
POST /posts: Create a new post.
PATCH /posts/:id: Update a post.
DELETE /posts/:id: Delete a post.
PATCH /posts/:id/likePost: Like a post.
Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature".
Push to branch: git push origin feature-name.
Open a pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
