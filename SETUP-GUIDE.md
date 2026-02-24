# 📖 სრული Setup Guide — CodeLearning პლატფორმა

## წინაპირობები

### 1. Node.js (v18+)
გადმოწერეთ და დააინსტალირეთ: [https://nodejs.org](https://nodejs.org)

```bash
node --version   # v18.0.0+
npm --version    # v9.0.0+
```

### 2. PostgreSQL (v15+)
გადმოწერეთ და დააინსტალირეთ: [https://www.postgresql.org/download](https://www.postgresql.org/download)

```bash
psql --version   # v15.0+
```

---

## მონაცემთა ბაზის კონფიგურაცია

### ბაზის შექმნა

```bash
# PostgreSQL shell-ში:
psql -U postgres

# შექმენით ბაზა:
CREATE DATABASE codelearning;

# გამოდით:
\q
```

### ცხრილების შექმნა

```bash
psql -U postgres -d codelearning -f schema.sql
```

ეს შექმნის 13 ცხრილს:
- `users` — მომხმარებლები
- `courses` — კურსები
- `lessons` — ლექციები
- `user_progress` — მოსწავლის პროგრესი
- `code_submissions` — კოდის სუბმიშენები
- `achievements` — მიღწევები
- `user_achievements` — მომხმარებლის მიღწევები
- `quizzes`, `quiz_questions`, `quiz_attempts` — ქვიზები
- `comments` — კომენტარები
- `notifications` — შეტყობინებები
- `course_enrollments` — კურსზე ჩარიცხვები

### საწყისი მონაცემების ჩატვირთვა

```bash
psql -U postgres -d codelearning -f seed.sql
```

---

## Backend კონფიგურაცია

### 1. `.env` ფაილის შექმნა

```bash
cd backend
cp .env.example .env
```

### 2. `.env` ფაილის რედაქტირება

```env
PORT=5000
NODE_ENV=development

# შეცვალეთ თქვენი PostgreSQL მონაცემებით:
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/codelearning

# შეცვალეთ უნიკალური გასაღებით:
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Frontend-ის URL:
CORS_ORIGIN=http://localhost:5173
```

### 3. დამოკიდებულებების დაინსტალირება

```bash
npm install
```

### 4. სერვერის გაშვება

```bash
# Development (auto-reload):
npm run dev

# Production:
npm start
```

სერვერი ამუშავდება `http://localhost:5000`-ზე.

### API ენდპოინტები

| Method | URL | აღწერა |
|--------|-----|--------|
| POST | `/api/auth/register` | რეგისტრაცია |
| POST | `/api/auth/login` | შესვლა |
| GET | `/api/auth/me` | პროფილი |
| GET | `/api/courses` | კურსების სია |
| GET | `/api/courses/:slug` | კურსის დეტალები |
| POST | `/api/courses/:id/enroll` | ჩარიცხვა |
| GET | `/api/lessons/:courseSlug/:lessonSlug` | ლექცია |
| POST | `/api/lessons/:id/submit` | კოდის გაგზავნა |
| GET | `/api/progress` | პროგრესი |
| GET | `/api/achievements` | მიღწევები |
| GET | `/api/leaderboard` | ლიდერბორდი |
| GET | `/api/admin/stats` | ადმინ სტატისტიკა |

---

## Frontend კონფიგურაცია

### 1. დამოკიდებულებების დაინსტალირება

```bash
cd frontend
npm install
```

### 2. Dev სერვერის გაშვება

```bash
npm run dev
```

Frontend ამუშავდება `http://localhost:5173`-ზე, ავტომატურად proxy-ებს API-ს backend-ზე.

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## პროექტის სტრუქტურა

```
backend/src/
├── index.js              # Express სერვერი + middleware
├── config/
│   └── db.js             # PostgreSQL pool
├── middleware/
│   ├── auth.js           # JWT ავთენტიფიკაცია
│   ├── admin.js          # ადმინ ავტორიზაცია
│   ├── errorHandler.js   # გლობალური error handler
│   └── validate.js       # Request validation
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── lessonController.js
│   ├── progressController.js
│   ├── achievementController.js
│   ├── leaderboardController.js
│   └── adminController.js
└── routes/
    ├── auth.js
    ├── courses.js
    ├── lessons.js
    ├── progress.js
    ├── achievements.js
    ├── leaderboard.js
    └── admin.js

frontend/src/
├── main.tsx              # React entry point
├── App.tsx               # Router + Layout
├── index.css             # Tailwind + Global styles
├── api/
│   └── axios.ts          # API client + interceptors
├── stores/
│   ├── authStore.ts      # Auth state (Zustand)
│   └── courseStore.ts    # Course state (Zustand)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CodeEditor.tsx    # CodeMirror wrapper
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
└── pages/
    ├── HomePage.tsx
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── CoursesPage.tsx
    ├── CourseDetailPage.tsx
    ├── LessonPage.tsx
    ├── ProfilePage.tsx
    ├── LeaderboardPage.tsx
    ├── AchievementsPage.tsx
    └── AdminPage.tsx
```

---

## Troubleshooting

### PostgreSQL კონექშენის შეცდომა
- შეამოწმეთ PostgreSQL სერვისი გაშვებულია თუ არა
- შეამოწმეთ `DATABASE_URL` `.env` ფაილში
- შეამოწმეთ პაროლი სწორია თუ არა

### CORS შეცდომა
- შეამოწმეთ `CORS_ORIGIN` `.env` ფაილში ემთხვევა frontend-ის URL-ს

### JWT შეცდომა
- შეამოწმეთ `JWT_SECRET` დაყენებულია `.env` ფაილში

---

შექმნილია ❤️-ით 🇬🇪 საქართველოში
