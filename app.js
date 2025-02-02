const express = require('express');
const mongoose = require('mongoose');
const faqRoutes = require('./routes/faqRoutes');
const config = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/faqs', faqRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});