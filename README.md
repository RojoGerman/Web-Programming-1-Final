# Web-Programming-1-Final
A web app that displays live NBA scores and data. A simple, yet effective alternative to official sports sites and apps.

The site pulls data from an NBA API which is then stored in a Mongo database.
From this, I use express to dynamically update the information on my index.ejs file.
The file that pulls from the API, "script.js" is a cron job that runs once per day at 10:30PM when all the games have conlcluded to show the final scores. 
