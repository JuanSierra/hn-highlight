const dotenv = require('dotenv');
const GistStorage = require('./giststorage');

dotenv.config({path: 'dot.env'});

const {
  GITHUB_PERSONAL_KEY,
  GIST_STORAGE_NAMESPACE
} = process.env;

const client = new GistStorage({
  personal_key: GITHUB_PERSONAL_KEY, 
  storage_namespace: GIST_STORAGE_NAMESPACE
});

//client.save(); 