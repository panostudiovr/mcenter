//Download EPG file using URL get with redirect

    var http = require('follow-redirects').http;
    var download = require('download-file');
    var gunzip = require('gunzip-file');
    var startBuilder = require('./builder.js');
    var add_to_mongodb = require("./to_mongodb.js");
    var today = new Date();

    var address = 'http://epg.kodibg.org/dl.php';
    var options = {
        directory: "./",
        filename: 'epg.xml.gz'
    }
    var epgFileName = 'epg.xml';

    add_to_mongodb.deleteFromMongoDb(today)
            
    http.get(address, function (response) {
        download(response.responseUrl, options, function (err, file) {
        if (err) throw err;
            gunzip('epg.xml.gz', epgFileName, function () {
                console.log("EPG file (" + epgFileName + ") downloaded successfully from " + address + "!");
                startBuilder.buildDatabase(today, function (err, data) {
                    if (err) throw err;
                    console.log('Module "Update_epg" passed data to Builder');
                });
            });
        });

    });

