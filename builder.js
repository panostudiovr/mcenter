//get required info from epg

exports.buildDatabase = function (today) {
    var fs = require("fs");
    var parser = require("xml2json");
    var add_to_mongodb = require("./to_mongodb.js");
    var get_info_from_imdb = require("./get_info.js")
   

    var channelArray = ['KinoNova', 'bTV', 'BNT1', 'BNT2', 'bTVAction', 'bTVComedy', 'bTVCinema', 'Nova', 'TV1000', 'VivacomArena', 'Diema', 'FOX', 'FilmBoxPlusHD'];
    var excludedTitles = ['Мармалад', 'МИСИЯ МОЯТ ДОМ', 'Денят започва', 'Здравей, България', 'София - Ден и Нощ', 'Тази сутрин', 'На кафе', 'Новите съседи', 'България днес', 'Съдби на кръстопът', 'Еротичен телепазар', 'Господари на ефира', 'Денят започва с Култура', 'Преди обед', 'България днес информационен блок', 'Добро утро с БНТ2', 'Темата на NOVA', 'Столичани в повече', 'Събуди се', 'Тази събота и неделя', 'Неделна литургия', 'Самолети, влакове и автомобили', 'Национална лотария /п/'];

    fs.readFile('./epg.xml', function (err, data) {
        var obj = parser.toJson(data),
            epg = JSON.parse(obj),
            programs = epg['tv']['programme'],
            movieName = "", movieIcon = "";

        for (i = 0; i < programs.length; i++) {
            if ((channelArray.includes(programs[i]['channel'])) && (programs[i]['stop'].substr(8, 6) - programs[i]['start'].substr(8, 6)) > 12500) {
                var movieDate = new Date(programs[i]['start'].substr(0, 4) + '-' + programs[i]['start'].substr(4, 2) + '-' + programs[i]['start'].substr(6, 2) + 'T' + programs[i]['start'].substr(8, 2) + ':' + programs[i]['start'].substr(10, 2) + ':' + programs[i]['start'].substr(12, 2));

                if (programs[i].title[0] == undefined) {
                    movieName = programs[i].title['$t'];
                } else {
                    movieName = programs[i].title[0]['$t'];
                }
                if ((excludedTitles.includes(movieName) === false) && (movieName.includes("сериал") === false) && (today.getDate() == movieDate.getDate())) {
                    get_info_from_imdb.searchImdbInfo(programs[i], movieName, today)
                };
            };
        }
    });
};