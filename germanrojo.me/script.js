#!/usr/bin/node
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');

const currentDateDenver = moment.tz('America/Denver');
const year = currentDateDenver.format('YYYY');
const month = currentDateDenver.format('MM');
const day = currentDateDenver.format('DD');


// Read the config file
const configPath = './config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

//API key and API end-point
//Put API key in seperate file and don't add to github
const apiKey = config.apiKey;
const apiUrl = `https://api.sportradar.com/nba/trial/v8/en/games/${year}/${month}/${day}/schedule.json`;


mongoose.connect('mongodb://localhost:27017/NBAgamesData');

// Define a schema for your NBA games
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

axios.get(apiUrl, {
    params: {
        api_key: apiKey,
    },
})
    .then(response => {
        const games = response.data.games;
        const league = response.data.league;
        const dates = response.data.date;

        if (games) {
            const totalGames = games.length;
            let gamesProcessed = 0;
            games.forEach(game => {
                // Create a new Game instance
                const newGame = new Game({
                    league: `${league.name}`,
                    date: `${dates}`,
                    gameId: `${game.id}`,
                    status: `${game.status}`,
                    homeTeam: `${game.home.name}`,
                    awayTeam: `${game.away.name}`,
                    //homeTeamScore: parseInt(game.home_points, 10),
                    homeTeamScore: String(game.home_points),
                    //awayTeamScore: parseInt(game.away_points, 10),
                    awayTeamScore: String(game.away_points),
                    homeTeamAlias: `${game.home.alias}`,
                    awayTeamAlias: `${game.away.alias}`,

                });

                // Save the game to MongoDB
                newGame.save()
                    .then(() => {
                        console.log('Game saved to MongoDB!');
                        gamesProcessed++;

                        if (gamesProcessed === totalGames) {
                            mongoose.connection.close();
                        }
                    })
                    .catch(err => console.error('Error saving game to MongoDB:', err));
            });
        } else {
            console.log('No games found for this date.');
        }
    })

    .catch(error => {
        console.error(error);
    });


