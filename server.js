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
  origin: ['https://nex-cart.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // To use the new URL parser
  useUnifiedTopology: true, // To use the new unified topology engine
  socketTimeoutMS: 45000,  // Increase socket timeout to 45 seconds
  connectTimeoutMS: 45000 // Increase connection timeout to 45 seconds
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