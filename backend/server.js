require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const emailRoutes = require('./routes/email');
const phoneRoutes = require('./routes/phone');
app.use('/api', phoneRoutes);

app.use("/api", require("./authRoutes"));

// Use routes with prefix /api
app.use('/api', emailRoutes);
// app.use('/api', phoneRoutes);

// Default root endpoint for quick test
app.get('/', (req, res) => {
  res.send('API Server is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
