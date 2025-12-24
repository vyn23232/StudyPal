# 📚 StudyPal - AI-Powered Study Assistant

c

## ✨ Features

- **Multiple Explanation Styles**: Simple, Analogy-Based, Step-by-Step, and Exam-Ready
- **Note Summarization**: Transform lengthy notes into focused summaries
- **Study History**: Track and review past explanations

## 🛠️ Tech Stack

**Frontend**: React 18, Vite  
**Backend**: Node.js, Express.js, MySQL, OpenAI API (GPT-4o-mini)

## 📋 Prerequisites

- Node.js (v18+)
- MySQL Server (v8.0+)
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Backend

Create `.env` file in the backend folder:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studypal_db
DB_PORT=3306
```

### 3. Setup Database

```bash
cd backend
mysql -u root -p < database.sql
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure

```
StudyPal/
├── backend/
│   ├── config/database.js       # MySQL connection
│   ├── controllers/studyController.js
│   ├── routes/studyRoutes.js
│   ├── services/openaiService.js
│   ├── database.sql
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── ExplainConcept.jsx
        │   ├── SummarizeNotes.jsx
        │   └── History.jsx
        └── App.jsx
```

## 🔧 API Endpoints

- `POST /api/study/explain` - Explain a concept with specific style
- `POST /api/study/summarize` - Summarize study notes
- `GET /api/study/history` - Get study history

## 🐛 Troubleshooting

**Backend won't start**
- Verify MySQL is running
- Check `.env` credentials
- Ensure port 5000 is available

**Database connection fails**
- Confirm MySQL is running: `mysql --version`
- Verify credentials in `.env`
- Create database if needed: `CREATE DATABASE studypal_db;`

**OpenAI API errors**
- Verify API key is correct
- Check OpenAI account credits
