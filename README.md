# 🗣️ OpinionBoard

A lightweight full-stack opinion sharing app built with React (Vite) and Node.js (Express).

Users can post opinions, read community thoughts, and vote (upvote/downvote).  
This project is built for learning full-stack development, REST APIs, and React state management.

---

## 🚀 Live Demo
Coming soon

---

## 📌 Features

- ✍️ Create new opinions (name, title, content)
- 📄 View all opinions
- 👍 Upvote / 👎 Downvote opinions
- ⚡ Optimistic UI updates
- 🔄 REST API integration
- 🧠 React Context state management

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Context API
- Fetch API
- CSS

### Backend
- Node.js
- Express.js
- JSON file database (db.json)

---

## 📁 Project Structure

client/
  src/
    components/
    context/
    App.jsx
    main.jsx

server/
  app.js
  db.json

---

## ⚙️ How It Works

User → React → API → Express → db.json → Response → UI update

---

## 🔌 API Endpoints

GET /opinions  
POST /opinions  
POST /opinions/:id/upvote  
POST /opinions/:id/downvote  

---

## 📦 Installation

git clone <repo-url>
cd opinionboard

npm install

cd server
npm install

---

## ▶️ Run Project

Backend:
cd server
npm start

Frontend:
npm run dev

---

## 🧠 What I Learned

- React basics
- Context API
- REST API
- Express backend
- CRUD operations

---

## 🚀 Future Improvements

- Login system
- Comments
- MongoDB database
- Real-time updates

---

## 👨‍💻 Author

Built by Moha Dev
