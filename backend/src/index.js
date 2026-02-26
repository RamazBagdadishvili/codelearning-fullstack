// ============================================
// ქართული Front-End სასწავლო პლატფორმა
// მთავარი სერვერის ფაილი
// ============================================

require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  // არ ვთიშავთ სერვერს - PM2 თვითონ გადატვირთავს საჭიროებისამებრ
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// როუტერების იმპორტი
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const achievementRoutes = require('./routes/achievements');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const commentRoutes = require('./routes/comments');


// Error Handler მიდლვეარი
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// მიდლვეარები (Middleware)
// ============================================

// უსაფრთხოების headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - მოთხოვნების შეზღუდვა
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'ძალიან ბევრი მოთხოვნა. გთხოვთ სცადოთ მოგვიანებით.' }
});
app.use('/api/', limiter);

// JSON Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// API როუტები
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);


// მთავარი endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'კეთილი იყოს თქვენი მობრძანება CodeLearning API-ზე!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      lessons: '/api/lessons',
      progress: '/api/progress',
      achievements: '/api/achievements',
      leaderboard: '/api/leaderboard',
      admin: '/api/admin'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'მოთხოვნილი რესურსი ვერ მოიძებნა.' });
});

// გლობალური Error Handler
app.use(errorHandler);

// ============================================
// სერვერის გაშვება
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 სერვერი გაშვებულია პორტზე: ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌍 გარემო: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
