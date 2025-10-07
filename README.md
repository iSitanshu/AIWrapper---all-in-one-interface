# 🤖 AIWrapper  

**AIWrapper** combines multiple artificial intelligences to deliver **comprehensive and accurate responses** tailored to your needs. It’s a unified AI chat system featuring authentication, conversation history, model selection, caching, and rate-limiting — all built for performance and scalability.  

---

## 🚀 Features  

- 🔐 **Authentication** – Secure login and user session management  
- 💬 **Chat System** – Chat seamlessly with integrated AI models  
- 📜 **Previous Conversations** – View and continue past chats anytime  
- 🧠 **Multiple Models** – Access multiple AI models for diverse capabilities  
- ⚙️ **Rate Limiting** – Prevents abuse and maintains performance stability  
- ⚡ **Redis Caching** – Stores recent responses for faster results  
- 🧩 **AI Responses** – Intelligent responses from multiple integrated AIs  
- 🐳 **Dockerized Backend** – Fully containerized using Docker for portability and deployment ease  

---

## 🖼️ Screenshots  

### 🔹 Conversations & Home  
See previous conversations and chat directly with AI in an intuitive interface.  

| Conversations | Home Layout |
|----------------|-------------|
| ![Conversations](./image/Conversations.jpg) | ![Home Layout](./image/Home_Layout.jpg) |  

---

## 🛠 Tech Stack  

### 🖥️ Frontend  
- [Next.js 13+ (App Router)](https://nextjs.org/)  
- [Shadcn/UI](https://ui.shadcn.com/) – Elegant, accessible UI components  
- [TailwindCSS](https://tailwindcss.com/) – Modern, responsive styling  

### ⚙️ Backend  
- [Bun](https://bun.sh/) – Fast backend runtime  
- [Prisma ORM](https://www.prisma.io/) – Database management  
- [PostgreSQL](https://www.postgresql.org/) – Relational database  
- [Docker](https://www.docker.com/) – Containerized environment for backend services  

---

## ⚙️ Installation & Setup  

### 1. Clone the repository  
```bash
git clone https://github.com/your-username/AIWrapper.git
cd AIWrapper
```

### 2. Setup Backend  
Move into the backend directory:  
```bash
cd backend
```

Generate Prisma client:  
```bash
bunx prisma generate
```

Apply migrations:  
```bash
bunx prisma migrate dev
```

---

### 3. Setup Database with Docker  
Run PostgreSQL inside a Docker container:  
```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```

This sets up a **Postgres database** running locally on port **5432**.  

---

### 4. Run the Backend  
```bash
bun run dev
```

---

### 5. Setup Frontend  
Move to the frontend directory and start the Next.js app:  
```bash
cd ../frontend
npm install
npm run dev
```

Your app should now be running at:  
👉 **http://localhost:3000**

---

## 🧩 Environment Variables  

Create a `.env` file in both backend and frontend directories with:  
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/aiwrapper"
NEXTAUTH_SECRET="your-secret"
REDIS_URL="your-redis-url"
```

---

## 🧠 Summary  

| Stack | Tools |
|-------|--------|
| **Frontend** | Next.js, TailwindCSS, Shadcn/UI |
| **Backend** | Bun, Prisma, PostgreSQL |
| **Infra** | Docker, Redis, Rate Limiting |
| **Core Features** | Auth, Conversations, Multi-AI Models |
