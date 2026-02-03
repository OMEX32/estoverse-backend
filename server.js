const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,       // prod (vercel)
  "http://localhost:3000"        // dev
].filter(Boolean);

app.use(cors({
  origin: function (origin, cb) {
    // allow requests like Postman/curl with no origin
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


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
});
