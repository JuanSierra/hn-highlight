const dotenv = require('dotenv');
const axios = require('axios');
const cronJob = require('cron').CronJob;
const GistStorage = require('./giststorage');
const History = require('./history');

dotenv.config({path: 'dot.env'});

const {
  GITHUB_PERSONAL_KEY,
  GIST_STORAGE_NAMESPACE
} = process.env;

const client = new GistStorage({
  personal_key: GITHUB_PERSONAL_KEY, 
  storage_namespace: GIST_STORAGE_NAMESPACE
});

const population = 100;
const tolerance = 3;
let generation = 1; // INCREMENT IT ON EACH CYCLE

const job = new cronJob('*/20 * * * * *', () => {
  // Increment Generation
  generation++;

  // Get HN news feed
  axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
  .then(function (response) {
    var latest = response.data;
    latest = latest.slice(0, 100);
    console.log('Got news');

    // Load history from local file
    var history = History.load();

    // Remove entries with generations out of tolerance
    history = history.filter(entry => generation - entry.gen < tolerance);
    console.log('Removed some entries from history');

    // Scoring
    for (let entry of latest){
      if(history[entry]===undefined){
        history[entry] = {gen:generation, score:1};
      }else{
        history[entry].score += 1;
      }
    }

    // Save to local
    History.save(history);
    
    // Filter last generation and save them at gist
    let current = history
      .filter(entry => entry.gen == generation)
      .map(x=>({entry: x, score: history[x].score}));

    client.save(current);
  })
  .catch(function (error) {
    console.log(error);
  });
});

job.start();