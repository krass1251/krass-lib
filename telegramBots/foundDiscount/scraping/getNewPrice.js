const needle = require('needle');
const cheerio = require('cheerio');


const getNewPrice = (URL, callback) => {
    needle.get(URL, function(err, res){
        if (err) throw err;
        const $ = cheerio.load(res.body);
        const newPrice = $('#productRecap span[aria-label]').attr("aria-label");
        callback(newPrice);
    });
}

module.exports = { getNewPrice };