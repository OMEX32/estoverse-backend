const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN
]

app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

// Try to load auth routes with error handling
try {
  console.log('📂 Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully!');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error.message);
  console.error('Stack:', error.stack);
}

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});



// Log all registered routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log('📍 Route:', r.route.path);
  }
});

app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
}); 