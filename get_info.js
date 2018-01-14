// Search cinefish.bg  
var request = require('request');
var encodeUrl = require('encodeurl');
var add_to_mongodb = require("./to_mongodb.js");
var googleApiKey = 'AIzaSyB5bndfxv-mS2NbFDd7LXng8dSAGgMBSl8';

exports.searchImdbInfo = function (programs, movieName) {
    var cinefishUrl = '#';
    var shortName = movieName;

    if (movieName.indexOf('-') > 0) {
        shortName = movieName.substr(0, movieName.indexOf('-') - 1);
    }
    var encodedName = encodeUrl(shortName);
    var googleSearchUrl = 'https://www.googleapis.com/customsearch/v1/?q=' + encodedName + '&key=' + googleApiKey + '&cx=009819804759932219582:wpchuroxcte&num=3&searchType=image';

    request(googleSearchUrl, function (err, response, body) {
        var info = JSON.parse(body);
      
        try {
            movieIcon = info.items[0].link
            cinefishUrl = info.items[0].image.contextLink;
        } catch (err) {
            movieIcon = 'https://www.cinefish.bg/images/no_photo_big.jpg';
        }
        console.log(shortName + ' --> ' + cinefishUrl);
        add_to_mongodb.addToMongoDb(movieName, movieIcon, programs['start'], programs['stop'], programs['channel'], cinefishUrl, shortName)
    });
};

