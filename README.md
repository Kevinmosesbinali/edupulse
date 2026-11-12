# 🎓 EduPulse – School Management System

**EduPulse** is a modern, web-based School Management System designed to simplify school administration, improve academic record management and streamline daily school operations.

The project aims to provide schools in Malawi and beyond with a centralised platform for managing students, teachers, classes, attendance, school fees, examinations and user accounts.

> **Project Status:** Active Development – Frontend Prototype

---

## 📌 Project Overview

EduPulse is being developed to reduce manual administrative work, improve access to school information and support efficient decision-making through a user-friendly digital platform.

The long-term goal is to provide a secure, reliable and scalable school management solution suitable for primary and secondary schools.

## ✨ Key Modules

The application currently includes a frontend foundation for the following modules:

### 1. Dashboard
- School statistics and overview.
- Student and teacher summaries.
- Attendance monitoring.
- School fees collection overview.
- Recent activity information.

### 2. Student Management
- Student registration.
- Student profile management.
- Admission number generation.
- Student record updates and management.

### 3. Teacher Management
- Teacher registration.
- Employee identification.
- Teacher information management.

### 4. Class Management
- Class creation and management.
- Subject management.
- Student and class organisation.

### 5. Attendance Management
- Daily attendance recording.
- Present and absent student tracking.
- Attendance statistics.

### 6. Fees Management
- Student fee records.
- Fee invoices.
- Payment recording.
- Outstanding balance tracking.
- Payment history.

### 7. Examinations and Results
- Examination management.
- Student marks recording.
- Grade calculation.
- Academic performance tracking.

### 8. User Accounts
- Administrator role.
- Teacher role.
- Bursar role.
- Role-based interface management.

---

## 🛠️ Technology Stack

The current frontend implementation uses:

| Technology | Purpose |
|---|---|
| React 19 | Frontend application |
| TypeScript | Application logic and type safety |
| Vite | Development server and build tool |
| Tailwind CSS 4 | User interface styling |
| Lucide React | Icons |
| Motion | Interface animations |
| Express | Backend dependency included in the project |
| Google GenAI SDK | AI integration dependency |

### Planned Backend and Database

Future development will introduce:
- Python and Flask or an alternative backend architecture.
- SQLite during initial development, with scope for PostgreSQL.
- Server-side authentication and authorisation.
- Centralised database storage.
- Secure API endpoints.

---

## 🚀 Getting Started

### Requirements

The project can be developed using a cloud-based development environment such as Replit.

For local development, Node.js and npm are required.

### Installation

Clone the repository:

```bash
git clone https://github.com/Kevinmosesbinali/edupulse.git
```

Navigate into the project:

```bash
cd edupulse
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The application will be available at the local development URL displayed by Vite.

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run lint
```

---

## 📂 Project Structure

```text
edupulse/
│
├── src/
│   ├── components/
│   │   ├── accounts/
│   │   ├── attendance/
│   │   ├── classes/
│   │   ├── dashboard/
│   │   ├── exams/
│   │   ├── fees/
│   │   ├── layout/
│   │   ├── students/
│   │   └── teachers/
│   │
│   ├── context/
│   │   └── SchoolContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── types/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Security and Data Management

The current prototype uses browser local storage and sample data for application demonstrations.

Production development will focus on:

- Secure user authentication.
- Role-based access control.
- Server-side data validation.
- Centralised database management.
- Protection of student and staff information.
- Secure handling of application secrets and API keys.
- Regular database backups.

**Important:** The current prototype should not be used to store real confidential student or financial information.

---

## 🗺️ Development Roadmap

| Feature | Status |
|---|---|
| Frontend foundation | In progress |
| Dashboard | Implemented in frontend |
| Student management | Frontend foundation |
| Teacher management | Frontend foundation |
| Class management | Frontend foundation |
| Attendance management | Frontend foundation |
| Fees management | Frontend foundation |
| Examinations and results | Frontend foundation |
| User account management | Frontend foundation |
| Backend API | Planned |
| Centralised database | Planned |
| Secure authentication | Planned |
| Reporting and document generation | Planned |
| Testing and deployment | Planned |

---

## 🎯 Project Objectives

1. Digitise school administration.
2. Improve student record management.
3. Simplify attendance and academic tracking.
4. Improve school fees monitoring.
5. Support efficient communication and information management.
6. Provide a scalable solution for schools in Malawi.

---

## 🤝 Contributions

EduPulse is under active development.

Suggestions, improvements and contributions are welcome as the project evolves.

---

## 👨‍💻 Developer

**Kevin Moses Binali**

GitHub: [@Kevinmosesbinali](https://github.com/Kevinmosesbinali)

Project Repository: [EduPulse](https://github.com/Kevinmosesbinali/edupulse)

---

## 📄 License

A formal open-source licence has not yet been selected. All rights are reserved by the project owner unless otherwise stated.

---

**EduPulse – Smarter School Management, Better Educational Administration.**
