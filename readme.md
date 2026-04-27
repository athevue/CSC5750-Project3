# Student Demo Registration System

## Overview
This project is a full-stack **Student Demo Registration System** built using:

- Node.js (Express.js)
- MySQL (Railway hosted database)
- HTML, CSS, JavaScript (frontend)
- REST API architecture

Students can register for project presentation time slots, and the system automatically tracks seat availability.

---

## Features

- Student registration (ID, name, project, email, phone)
- Time slot booking system (6 slots total)
- Automatic seat tracking per time slot
- Update existing student registration
- View all registered students
- Real-time slot availability updates
- Server-side validation using Node.js

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (Railway)
- **Frontend:** HTML, CSS, JavaScript
- **Hosting:** Render (backend + frontend)

---

## Installation & Setup (Local)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CSC5750-Project3.git
cd CSC5750-Project3
npm install
create .env file with credentials
node server.js