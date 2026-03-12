# Fitness Tracker

Personal fitness tracker web app – OCR A-Level Computer Science project (H446-03).

## Stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Prisma** + SQLite (portable database)
- **bcryptjs** for password hashing (security/validation for mark scheme)

## Features

- User registration and login (hashed passwords)
- Log workouts (type, duration, intensity, date, notes)
- Workout history
- Dashboard (recent workouts, counts)
- Progress (total time, by activity type, this week)

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register a user and start logging workouts.

## Project info

- **Candidate:** Hicham Derrouiche  
- **Centre:** 13284 · **School:** Six 21  
- **Title:** Personal Fitness Tracker
