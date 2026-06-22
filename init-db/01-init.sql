-- User Service Database
CREATE DATABASE IF NOT EXISTS user_service_db;
USE user_service_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  phone      VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Notepad Service Database
CREATE DATABASE IF NOT EXISTS notepad_service_db;
USE notepad_service_db;

CREATE TABLE IF NOT EXISTS notepads (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  request_id VARCHAR(100) UNIQUE,
  user_id    INT NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT,
  status     ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
);