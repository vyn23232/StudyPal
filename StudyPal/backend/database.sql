-- StudyPal Database Schema

CREATE DATABASE IF NOT EXISTS studypal_db;
USE studypal_db;

-- Table to store study history
CREATE TABLE IF NOT EXISTS study_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    style ENUM('simple', 'analogy', 'stepByStep', 'examReady') DEFAULT 'simple',
    explanation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_topic (topic)
);

-- Table to store note summaries
CREATE TABLE IF NOT EXISTS summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_notes TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);

-- Optional: Table for user accounts (if you want to add authentication later)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
