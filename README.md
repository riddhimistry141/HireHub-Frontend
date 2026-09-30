# HireHub Frontend

A modern recruitment platform frontend for job seekers, recruiters, and administrators, built with React and Vite.

## Overview
HireHub is designed to streamline the hiring lifecycle by combining job discovery, application tracking, recruiter workflows, and admin oversight in a single experience.

## Features
- User-friendly landing page
- Login and registration flows
- Job search and job detail pages
- Profile management for users
- Recruiter dashboard and job management
- Applicant tracking and interview workflow
- Admin dashboard for oversight and management
- Responsive UI built with reusable components

## Tech Stack
- React
- Vite
- JavaScript
- React Router
- Tailwind CSS
- Lucide icons
- Custom component library

## Project Structure
```bash
src/
├── components/
│   ├── admin-pages/
│   ├── auth/
│   ├── layouts/
│   ├── recruiter-pages/
│   ├── theme/
│   ├── ui/
│   └── user-pages/
├── App.jsx
├── App.css
├── main.jsx
├── index.css
└── lib/
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app locally
```bash
npm run dev -- --host 0.0.0.0
```

### 3. Build the app for production
```bash
npm run build
```

### 4. Run lint checks
```bash
npm run lint
```

## Screenshots

### Landing Page
![Landing Page](src\project_ss\landing-page.png)

### Login Page
![Login Page](src\project_ss\login-page.png)

### Register Page
![Register Page](src\project_ss\register-page.png)

### Admin Dashboard
![Admin Dashboard](src\project_ss\admin_dashbord.png)

### Recruiter Dashboard
![Recruiter Dashboard](src\project_ss\recruiter_dashbord.png)

### User Dashboard
![User Dashboard](src\project_ss\user_dashbord.png)

## Notes
- Routing is managed in `src/App.jsx`.
- Shared UI components are organized under `src/components/ui`.
- The app is structured around three main roles: user, recruiter, and admin.

## License
This project is intended for learning and portfolio use.
