const dotenv = require('dotenv');
const GistStorage = require('./giststorage');
const axios = require('axios');
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
let generation = 1; // INCREMENT

axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

let f = [22972661,22970120,22970771,22971656,22969533,22970693,22971863,22973455,22960225];
let s = [22972661,22970120,22970771,22971656,22969531,22970693,22971863,22973454,22960224];
//let t = [22972661,22970120,22970772,22971656,22969531,22970698,22971863,22973455,22960225];
  
let history = [];
for (let entry of f){
  history[entry] = {gen:generation, score:1};
}

// .  ..  ..  .. 

history = history.filter(entry => generation - entry.gen < tolerance);
console.log(history)
for (let c of s){
  if(history[c]===undefined){
    history[c] = {gen:generation, score:1};
  }else{
    history[c].score += 1;
  }
}

let current = history
                .filter(entry => entry.gen == generation)
                .map(x=>({entry: x, score: history[x].score}));