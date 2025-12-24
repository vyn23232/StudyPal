# 🚀 Render Deployment Guide

## Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

## Step 2: Deploy MySQL Database
1. Click **"New +"** → **"PostgreSQL"** OR use **MySQL via Docker**
   
   **Option A: Use Render's PostgreSQL** (Recommended)
   - Render offers free PostgreSQL (you'll need to adapt your code slightly)
   
   **Option B: Use External MySQL** (Railway, PlanetScale, or Aiven)
   - Get a MySQL database from Railway.app or PlanetScale
   - Copy the connection details

## Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `studypal-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

## Step 4: Add Environment Variables
In the Render dashboard, add these environment variables:

```
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=studypal_db
DB_PORT=3306
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## Step 5: Initialize Database
1. Connect to your MySQL database using the credentials
2. Run the SQL from `database.sql` to create tables

### Using MySQL Client:
```bash
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> < backend/database.sql
```

### Using Render Shell:
1. Go to your web service → **Shell** tab
2. If using MySQL, install client: `apt-get update && apt-get install -y mysql-client`
3. Connect: `mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME`
4. Copy and paste SQL from `database.sql`

## Step 6: Update Frontend
Update your frontend environment variable to point to your new backend:
```
VITE_API_URL=https://studypal-backend.onrender.com
```

Redeploy your Netlify site with the new environment variable.

## Step 7: Test Your API
Once deployed, test:
```
https://your-backend.onrender.com/api/health
```

Should return: `{"status":"OK","message":"StudyPal API is running"}`

## 📝 Notes
- Free tier sleeps after 15 min of inactivity (first request may be slow)
- Upgrade to paid plan ($7/mo) for always-on service
- Monitor logs in Render dashboard for debugging

## 🔧 Troubleshooting
- **Database Connection Failed**: Check DB credentials in environment variables
- **CORS Error**: Ensure FRONTEND_URL matches your Netlify domain exactly
- **OpenAI Error**: Verify OPENAI_API_KEY is correct and has credits

## Alternative: PostgreSQL Setup
If using Render's PostgreSQL instead of MySQL:
1. Install `pg` instead of `mysql2`: `npm install pg`
2. Update `config/database.js` to use PostgreSQL connection
3. Convert SQL schema to PostgreSQL syntax
