const fs = require('fs')

module.exports = class History {
    constructor(date, entries) {
        this.path = "history.js";
        this.date = date;
        this.entries = entries;
    }
 
    save() {
        var serialized = JSON.stringify({date: this.date, entries: this.entries} );

        fs.writeFile(this.path , serialized, function (err,data) {
            if (err) {
              return console.log(err);
            }
            console.log(data);
        });
    }

    load(){
        try {
            if (fs.existsSync(path)) {
                var data = fs.readFileSync(this.path, 'utf8');
                var deserialized = JSON.parse(data);

                if(deserialized.hasOwnProperty('date') && deserialized.hasOwnProperty('entries')){
                    this.date = deserialized.date;
                    this.entries = deserialized.entries;
                }

                throw "Fatal error when deserializing history"; 
            }

            this.entries = {};
        }
        catch(err) {
            console.error(err)
        }
    }
 }