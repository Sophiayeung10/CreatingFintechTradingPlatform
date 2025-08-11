const express = require('express');
const cors = require('cors');
const router = require('./authRoutes');
const app = express();

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (Step 2 implementation)
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Mount auth routes
app.use('/api/auth', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SwingPhi TouchID Auth Server is running' });
});

//test
app.get('/test', (req, res) => res.send('Test route works'));


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 SwingPhi TouchID Auth Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}/api/auth`);
});