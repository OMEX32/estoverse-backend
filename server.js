const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://estoverse-frontend.vercel.app' // Hardcoded backup
].filter(Boolean); // Remove undefined values

console.log('🔒 Allowed CORS origins:', allowedOrigins); // Debug

app.use(cors({
  origin: function (origin, cb) {
    console.log('🌐 Incoming request from origin:', origin); // Debug
    
    if (!origin) return cb(null, true); // Allow requests with no origin
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed for:', origin);
      return cb(null, true);
    }
    
    console.error('❌ CORS blocked origin:', origin);
    console.error('Expected one of:', allowedOrigins);
    return cb(null, false); // Reject but don't crash
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
  console.log('🔒 Allowed origins:', allowedOrigins);
  
  // Log all registered routes
  if (app._router) {
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        console.log('📍 Route:', r.route.path);
      }
    });
  }
});