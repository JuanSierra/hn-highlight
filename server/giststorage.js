const { Octokit } = require("@octokit/core");
const defaults = {
  personal_key: null,
  storage_namespace : "DEFAULT-NAMESPACE"
};

class GistStorage {
  constructor(options) {
    const config = Object.assign({}, defaults, options);
	const octokit = new Octokit({ auth: config.personal_key });

    this.octokit = octokit;
	this.config = config;
	this.namespace = config.storage_namespace;
  }
  
  async save(){
	if(this.exist()){
		this.update()
	}else{
		this.create()
	}
  }

  async create(){
	try {
		const response = await this.octokit.request("POST /gists", {
			"description": "Gist post test",
			"public": true,
			"files": {
				"commondata.json": {
					"content": "{\"datetime\":\"2012-04-23T18:25:43.511Z\"}"
				}
			}
		});
		
		console.log({ repos: response.data });
	} catch (err) {
		console.error({ error: err.message || err.toString() });
	}
  }

  async exist(){
	try {
		const response = await this.octokit.request("GET /gists/public");
		
		for(let gist of response.data) {
			if(gist.description == this.namespace)
				return true
		}

		return false;
	} catch (err) {
		console.error({ error: err.message || err.toString() });
	}
  }
}

module.exports = GistStorage;