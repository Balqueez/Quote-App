const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/quotesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schema + Model
const quoteSchema = new mongoose.Schema({
  name: String,
  quote: String
});
const Quote = mongoose.model('Quote', quoteSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/submit', async (req, res) => {
  const { name, quote } = req.body;
  if (name && quote) {
    try {
      await Quote.create({ name, quote });
    } catch (err) {
      console.error(' Failed to save:', err);
    }
  }
  res.redirect('/quotes');
});

app.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().lean();
    res.render('quotes', { quotes });
  } catch (err) {
    res.status(500).send('Error fetching quotes');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
