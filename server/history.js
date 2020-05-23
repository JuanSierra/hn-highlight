const fs = require('fs')
const path = "hn-history.json";

class History {
    static save(entries) {
        let ts = Date.now();
        let date_ob = new Date(ts);

        var serialized = JSON.stringify({date: date_ob, entries: entries} );

        try{
            fs.writeFileSync(path , serialized);
            console.log(`Data saved! ${serialized}`);    
        } catch (err) {
            console.error({ error: err.message || err.toString() });
        }
            /*fs.writeFile(this.path , serialized, function (err,data) {
            if (err) {
              return console.log(err);
            }
            console.log(`Data saved! ${data}`);
        });*/
    }

    static load(){
        try {
            if (fs.existsSync(path)) {
                var data = fs.readFileSync(path, 'utf8');
                var deserialized = JSON.parse(data);

                if(deserialized.hasOwnProperty('date') && deserialized.hasOwnProperty('entries')){
                    // this.date = deserialized.date; // internal reference
                    console.log("aqui")
                    console.log(deserialized.entries)
                    return deserialized.entries;
                }

                throw "Fatal error when deserializing history"; 
            }

            return {};
        }
        catch(err) {
            console.error(err)
        }
    }
 }

 module.exports = History;