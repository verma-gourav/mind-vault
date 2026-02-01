# Mind Vault

A second brain like website where you can store important tweets, links, documents etc.

---

## DEMO

![Video](https://github.com/user-attachments/assets/4fe23a67-c5b8-4a52-a05c-55215d3e5139)

---

## Features

- User authentication (Signup/Login with JWT)
- Save and manage different types of content:
- Tweets
- YouTube videos
- Documents
- Links
- Add and manage tags
- Share your "brain" via a unique link
- Unshare anytime (links become invalid)
- Auto logout when JWT token expires
- Modern UI with React + Tailwind

---

## Tech Stack

**Frontend:**

- React (Vite)
- TypeScript
- TailwindCSS

**Backend:**

- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Zod (Validation)

---

## Project Structure

```bash
.
├── backend/ # Express + MongoDB API
│ ├── db.js
│ ├── middleware.js
│ ├── server.ts (or index.ts)
│ └── .env.example
│
├── frontend/ # React + Vite + Tailwind
│ ├── src/
│ └── .env.example
│
├── .gitignore
├── README.md

```

---

## Setup Instructions

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/mind-vault.git
cd mind-vault
```

### 2 Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # update values
npm run dev            # start server
```

### 3 Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env # update values
npm run dev # start frontend
```

---

## Environment Variables

### Backend (backend/.env)

```bash
MONGO_URL=your_mongo_url_here
SECRET_KEY=your_secret_here
FRONTEND_URL=http://127.0.0.1:5173
```

### Frontend (frontend/.env)

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

---

## License

MIT License

> > > > > > > bf005cf (updated readme)
