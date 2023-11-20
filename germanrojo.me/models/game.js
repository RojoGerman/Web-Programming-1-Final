const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  league: String,
  date: String,
  gameId: String,
  status: String,
  homeTeam: String,
  awayTeam: String,
  homeTeamScore: String,
  awayTeamScore: String,
  homeTeamAlias: String,
  awayTeamAlias: String,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
