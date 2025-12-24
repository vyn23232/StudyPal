# StudyPal Backend

Backend API for StudyPal - An AI-powered study assistant.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server
- OpenAI API Key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` file and add your configuration:
   - Add your OpenAI API key
   - Configure your MySQL credentials

4. Set up the database:
```bash
mysql -u root -p < database.sql
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/study/explain
Explain a concept in various styles.

**Request Body:**
```json
{
  "topic": "photosynthesis",
  "style": "simple"
}
```

**Styles:** `simple`, `analogy`, `stepByStep`, `examReady`

### POST /api/study/summarize
Summarize study notes.

**Request Body:**
```json
{
  "notes": "Your study notes here..."
}
```

### GET /api/study/history
Get recent study history.

### GET /api/health
Health check endpoint.
