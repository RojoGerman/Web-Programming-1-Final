const express = require('express');
const mongoose = require('mongoose'); // Add this line
const Game = require('./models/game'); // Update the path accordingly
const moment = require('moment-timezone');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/NBAgamesData');

app.get('/', async (req, res) => {
  try {
    const currentDateDenver = moment.tz('America/Denver');
    const year = currentDateDenver.format('YYYY');
    const month = currentDateDenver.format('MM');
    const day = currentDateDenver.format('DD');

    console.log(`${year}-${month}-${day}`);

    // Fetch games with the specified date from MongoDB
    const games = await Game.find({ date: `${year}-${month}-${day}` });

    // Render the index.ejs template with the fetched games
    res.render('index', { games });
  } catch (error) {
    console.error('Error fetching games from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/playerStats', (req, res) => {
  // You can add more logic here to fetch and render player statistics
  res.render('playerStats');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

