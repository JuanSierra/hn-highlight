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

const job = new cronJob('*/20 * * * * *', () => {
  // Get HN news feed
  axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
  .then(function (response) {
    let latest = response.data;
    latest = latest.slice(0, population).map(x=>x.toString());

    console.log('Got news');
    // Load history from local file
    let [history, generation] = History.load();
    
    // Remove entries with generations out of tolerance
    if(Object.keys(history).length !== 0){
      history = Object.keys(history)
        .filter(key => generation - history[key].gen < tolerance)
        .reduce( (res, key) => Object.assign(res, { [key]: history[key] }), {} );
    }

    // Increment Generation
    generation++;
    
    // Scoring
    for (let entry of latest){
      if(history[entry]!==undefined){
        history[entry] = { gen:generation, score:history[entry].score + 1 };
      }else{
        history[entry] = { gen:generation, score:1 };
      }
    }
    
    // Save to local
    History.save(history, generation);
    
    // Assign historical score to last generation and save them at gist
    let current = latest
      .map(x=>({ entry: x, score:  history[x].score }));
    console.log('trying to save at gist')
    
    client.save('commondata', current);
  })
  .catch(function (error) {
    console.log(error);
  });
});

job.start();