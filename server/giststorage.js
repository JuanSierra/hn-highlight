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
	this.gist_id = '';
  }
  
  async save(name, obj){
	const doc = JSON.stringify(obj);

	if(this.exist()){
		this.update(name, doc)
	}else{
		this.create(name, doc)
	}
  }

  async create(name, doc){
	try {
		const filename = `${name}.json`;
		const response = await this.octokit.request("POST /gists", {
			"description": this.namespace,
			"public": true,
			"files": {
				[filename] : {
					"content": doc
				}
			}
		});
		
		this.gist_id = response.data.id;
		console.log({ repos: response.data });
	} catch (err) {
		console.error({ error: err.message || err.toString() });
	}
  }

  async update(name, doc){
	try {
		const filename = `${name}.json`;
		const response = await this.octokit.request(`PATCH /gists/${this.gist_id}`, {
			"description": this.namespace,
			"files": {
				[filename] : {
					"content": doc
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
		
		if (this.gist_id != '')
			return true;

		for(let gist of response.data) {
			if(gist.description == this.namespace){
				this.gist_id = gist.id;

				return true;
			}
		}

		return false;
	} catch (err) {
		console.error({ error: err.message || err.toString() });
	}
  }
}

module.exports = GistStorage;