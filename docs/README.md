# PhishGuard

## Full-Stack Phishing URL Detection and Cybersecurity Awareness Platform

PhishGuard is a full-stack cybersecurity platform designed to analyze URLs, identify suspicious indicators, calculate phishing risk, and provide users with understandable security explanations.

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, React Router
- Backend: Python, FastAPI
- Database: PostgreSQL
- Authentication: JWT
- Email Verification: Gmail SMTP with 6-digit OTP
- Testing: Pytest
- Version Control: Git

## Main Features

- User registration and login
- Mandatory email verification
- 6-digit OTP verification
- OTP expiry, resend cooldown, and attempt protection
- Secure password authentication
- JWT-based authentication
- Phishing URL scanning
- Risk score from 0-100
- LOW, MEDIUM, and HIGH risk classification
- Suspicious indicator explanations
- Scan history
- Security dashboard
- Risk distribution visualization
- User profile
- Admin authorization
- Admin user management
- Account activation/deactivation

## Current Verification

- Backend tests: 8/8 passed
- Backend dependency check: passed
- Frontend production build: passed
- Backend API health check: passed
- Frontend HTTP check: 200 OK
- Safe URL test: 0/100 LOW
- Suspicious URL test: 70/100 HIGH
- Dashboard verification: passed
- Profile verification: passed
- Admin panel verification: passed
- Git working tree: clean

## Running the Project

### Backend

```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
