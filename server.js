const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
}));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);

// Home route for testing server
app.get('/', (req, res) => {
    res.send('Welcome to the NexCart API');
});

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});