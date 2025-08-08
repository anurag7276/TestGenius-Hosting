# 🧪 TestGenius: AI-Powered Test Case Generation

> **Your AI teammate for writing clean, professional, and ready-to-use test cases — directly from your GitHub repositories.**

---

## 🚀 Project Overview

**TestGenius** is a full-stack web application designed to streamline test case generation for developers.

By integrating with your GitHub account, you can:

- 📂 **Select specific repositories and files**  
- 🤖 **Generate AI-powered summaries** of file functionality  
- 🧾 **Automatically create ready-to-use test cases** in frameworks like **Jest** or **Pytest**

---

## 💡 Why?

Writing unit tests is essential but often time-consuming and repetitive. TestGenius automates this process so you can focus on building features while ensuring high code quality.

---

## ✨ Key Features

- ✅ **GitHub OAuth Authentication** – Secure, one-click login via GitHub  
- ✅ **Repository & File Selection** – Browse both public & private repos easily  
- ✅ **AI-Powered Summaries** – Get clear explanations & suggested test cases  
- ✅ **Automatic Test Code Generation** – Supports multiple frameworks  
- ✅ **Modern UI/UX** – Guided, multi-step process from login to test download

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React** – Dynamic, component-driven UI  
- ⚡ **Vite** – Fast dev environment & builds  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 📡 **Axios** – API communication

### Backend
- 🟩 **Node.js** – JavaScript runtime  
- 🚏 **Express.js** – Robust API framework  
- 🔑 **Passport.js** – GitHub OAuth integration  
- 🔒 **dotenv** – Secure environment variable management

### Auth & Deployment
- 🔐 **GitHub OAuth** – Secure login  
- ▲ **Vercel** – Full-stack app deployment

---

## 📁 Project Structure

TestGenius/  
├── client/              # Frontend React application  
│   ├── src/  
│   ├── public/  
│   ├── package.json  
│   └── vite.config.js  
└── server/              # Backend Node.js & Express API  
    ├── routes/  
    ├── node_modules/  
    ├── .env.example  
    └── package.json  

---

## ⚙️ Local Setup

Follow these steps to run **TestGenius** locally.

### 1️⃣ Clone the Repository

git clone https://github.com/anurag7276/TestGenius-Hosting.git.  
cd TestGenius-Hosting.

### 2️⃣ Configure GitHub OAuth App
Go to GitHub → Settings → Developer settings → OAuth Apps.
Click New OAuth App. 
Set:. 
Homepage URL: http://localhost:5173
Authorization callback URL: http://localhost:3001/api/github/callback 
Copy the Client ID & Client Secret


### 3️⃣ Backend Setup

cd server 
npm install  

GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret 
VITE_APP_BACKEND_URL=http://localhost:3001
PORT=3001
Run backend:  npm start  

### 4️⃣ Frontend Setup
cd ../client 
npm install
Create a .env file:
VITE_APP_BACKEND_URL=http://localhost:3001 
Run frontend:  npm run dev  
💻 Your app will now be live at: http://localhost:5173 🎉 
🧠 Key Learnings 
🔐 Authentication Handling – Secure GitHub OAuth + session management
⚙️ Environment Config – Separate dev & prod configs to avoid redirect issues

🔄 State Management – Handling complex state in multi-step processes



🔮 Future Improvements
📝 Custom AI Prompts – Let users personalize test case generation style

📂 Multi-File Analysis – Generate integration tests spanning multiple files

📊 Test Execution & Reports – Run tests & show results inside the app

🙏 Acknowledgements

Thanks for checking out TestGenius!
I’m open to feedback, suggestions, and collaboration opportunities.

💬 Let’s connect on LinkedIn:- https://www.linkedin.com/in/anurag-singh-6366a1293/

⭐ If you like this project, don’t forget to star the repo!





