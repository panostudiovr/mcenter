// Add records to mongodb 
var mongodbClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/secondtest";
var mongoUpsert = { upsert: true };

exports.addToMongoDb = function (movieName, movieIcon, movieStart, movieStop, channel, imdbUrl, shortName, today) {
    mongodbClient.connect(url, (err, db) => {
        if (err) throw err;
        var exsistObj = { shortName: shortName };
        var myObj = { movieName: movieName, icon: movieIcon, movieStart: movieStart, movieStop:movieStop, channel:channel, dateAdded: today, imdbUrl: imdbUrl, shortName: shortName }
        db.collection("testmovies").update(exsistObj, myObj, mongoUpsert, function (err, res) {
            if (err) throw err;
            console.log("Record added" + '---> ' + shortName);
            db.close();
            
        });
    });
};

exports.deleteFromMongoDb = function (today){
    
    mongodbClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection('testmovies').find({}).toArray( function (err, result) {
            if (err) throw err;
            for (i = 0; i < result.length - 1; i++) {
                if (today - Date.parse(result[i].dateAdded) > 604800000) {
                    recordForDeletion = result[i]._id
                    db.collection('testmovies').remove({ _id: recordForDeletion });
                }
            }
            console.log('Records older than 7 days removed'); 
            db.close();
        });

    });

};