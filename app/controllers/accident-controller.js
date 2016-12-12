var User = require('../models/user.js');
var Accident = require('../models/accident.js');
var Notification = require('../models/notification.js');


var userController = require('./user-controller');
var notificationController = require('./notification-controller');


function addAccident(request, response) {
    if (typeof(request.body.roadType) == 'undefined' || typeof(request.body.busType) == 'undefined' || typeof(request.body.date) == 'undefined' || typeof(request.body.adress) == 'undefined' || typeof(request.body.ligne) == 'undefined' || typeof(request.body.accident_type) == 'undefined' || typeof(request.body.degats_physiques) == 'undefined' || typeof(request.body.degats_corporels) == 'undefined' || typeof(request.body.injuriesNumber) == 'undefined' || typeof(request.body.deathsNumber) == 'undefined' || typeof(request.body.location) == 'undefined') {
        response.json({message: 'error: fields required', code: -1});
        return;
    }
    var token = userController.isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    if(typeof (request.body.district)=='undefined')
        request.body.district=null;
    if(typeof (request.body.numeroBus)=='undefined')
        request.body.numeroBus=null;
    if(typeof (request.body.numeroPv)=='undefined')
        request.body.numeroPv=null;
    if(typeof (request.body.posteGardePolice)=='undefined')
        request.body.posteGardePolice=null;
    if(typeof (request.body.observation)=='undefined')
        request.body.observation=null;

    var newAccident = new Accident({
            roadType: request.body.roadType,
            busType: request.body.busType,
            date: request.body.date,
            adress: request.body.adress,
            ligne: request.body.ligne,
            accident_type: request.body.accident_type,
            degats_physiques: request.body.degats_physiques,
            degats_corporels: request.body.degats_corporels,
            injuriesNumber: request.body.injuriesNumber,
            deathsNumber: request.body.deathsNumber,
            location: {
                coordinates: request.body.location.split(',').map(Number)
            },
            district:request.body.district,
            numeroBus:request.body.numeroBus,
            numeroPv:request.body.numeroPv,
            posteGardePolice:request.body.posteGardePolice,
            observation:request.body.observation,
            user: token.id
        }
    );

    newAccident.save(function (error, accident) {
        if (error) {
            console.error('Not able to create Accident b/c:', error);
            response.json({message: 'Not able to create Accident', code: -2});
        }
        else {
            //console.log(accident);
            addAccidentToUser(accident);
            notificationController.addNotification(accident);
            //response.json({message: 'Accident successfully aded', code: 1});
        }
    });

    function addAccidentToUser(accident) {
        User.findById(accident.user, function (error, user) {
            if (error) {
                console.error('Could not retrieve user b/c:', error);
                response.json({message: 'error: user not found', code: -1});
            }
            else {
                user.accident.push(accident._id);
                user.save(function (error, accident) {
                    if (error) {
                        console.error('Not able to update User b/c:', error);
                        response.json({message: 'Not able to update User', code: -2});
                    }
                    else {
                        response.json({message: 'Accident successfully aded', code: 1});
                    }
                });
            }
        });
    }

};

function updateAccident(request, response) {
    if (typeof(request.body.roadType) == 'undefined' || typeof(request.body.busType) == 'undefined' || typeof(request.body.date) == 'undefined' || typeof(request.body.adress) == 'undefined' || typeof(request.body.ligne) == 'undefined' || typeof(request.body.accident_type) == 'undefined' || typeof(request.body.degats_physiques) == 'undefined' || typeof(request.body.degats_corporels) == 'undefined' || typeof(request.body.injuriesNumber) == 'undefined' || typeof(request.body.deathsNumber) == 'undefined' || typeof(request.body.location) == 'undefined' || typeof(request.body.accidentId) == 'undefined') {
        response.json({message: 'error: fields required', code: -1});
        return;
    }
    var token = userController.isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    if(typeof (request.body.district)=='undefined')
        request.body.district=null;
    if(typeof (request.body.numeroBus)=='undefined')
        request.body.numeroBus=null;
    if(typeof (request.body.numeroPv)=='undefined')
        request.body.numeroPv=null;
    if(typeof (request.body.posteGardePolice)=='undefined')
        request.body.posteGardePolice=null;
    if(typeof (request.body.observation)=='undefined')
        request.body.observation=null;

    Accident.update({
        "_id": request.body.accidentId
    }, {
        roadType: request.body.roadType,
        busType: request.body.busType,
        date: request.body.date,
        adress: request.body.adress,
        ligne: request.body.ligne,
        accident_type: request.body.accident_type,
        degats_physiques: request.body.degats_physiques,
        degats_corporels: request.body.degats_corporels,
        injuriesNumber: request.body.injuriesNumber,
        deathsNumber: request.body.deathsNumber,
        location: {
            coordinates: request.body.location.split(',').map(Number)
        },
        district:request.body.district,
        numeroBus:request.body.numeroBus,
        numeroPv:request.body.numeroPv,
        posteGardePolice:request.body.posteGardePolice,
        observation:request.body.observation
    }, function (err, model) {
        if (err) {
            console.error('Not able to edit Accident b/c:', error);
            response.json({message: 'error', code: -2});
        }
        else
            response.json({message: 'Accident successfully edited', code: 1});
    });
};

function removeAccident(request, response) {
    var token = userController.isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;

    Accident.findById(request.body.id, function (error, accident) {
        if (error || accident==null) {
            console.error('Not able to remove Accident b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else {
            console.log(accident);
            User.findOneAndUpdate({_id: accident.user}, {
                    $pull: {
                        accident: accident._id
                    }
                }
                , function (error, user) {
                    if (error) {
                        console.error('Not able to remove Accident b/c:', error);
                        response.json({message: 'error', code: -2});
                    }
                    else {
                        accident.remove();
                        response.json({message: 'Accident successfully removed', code: 1});
                    }
                }
            );
        }
    });
    /*
    Accident.remove({_id: request.body.id}, function (error) {
        if (error) {
            console.error('Not able to remove Accident b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else {
            User.findOneAndUpdate({'accident._id': request.body.id},
                {
                    $pull: {subArray: {_id: request.body.id}}
                }, function (err, doc) {
                    response.json({message: 'Accident successfully removed', code: 1});
                });
        }
    });
    */
};

function listAccident(request, response) {
    var token = userController.isAuthorized(request, response, ["admin", "APCR"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Accident.find({}, function (error, accidents) {
        if (error) {
            console.error('Not able to remove Accident b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else
            response.json({data: accidents, code: 1});
    }).sort('-date');
};

function findAccidentById(request, response) {
    var token = userController.isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Accident.findById(request.params.id, function (error, accident) {
        if (error) {
            console.error('Could not retrieve accident b/c:', error);
            response.json({message: 'error: accident not found', code: -1});
        }
        else
            response.json({data: accident, code: 1});
    }).populate("user", '-password');
};

function statAccident(request, response) {
    var token = userController.isAuthorized(request, response, ["admin", "APCR"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Accident.find({}, function (error, accidents) {
        if (error) {
            console.error('Not able to remove Accident b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else{
            var result = [];
            var weekday = new Array(7);
            weekday[0]=  "Dimanche";
            weekday[1] = "Lundi";
            weekday[2] = "Mardi";
            weekday[3] = "Mercredi";
            weekday[4] = "Jeudi";
            weekday[5] = "Vendredi";
            weekday[6] = "Samedi";
            var hour=["00h00 => 00h59", "01h00 => 01h59", "02h00 => 02h59", "03h00 => 03h59", "04h00 => 04h59"
                     , "05h00 => 05h59", "06h00 => 06h59", "07h00 => 07h59", "08h00 => 08h59", "09h00 => 09h59"
                     , "10h00 => 10h59", "11h00 => 11h59", "12h00 => 12h59", "13h00 => 13h59", "14h00 => 14h59"
                     , "15h00 => 15h59", "16h00 => 16h59", "17h00 => 17h59", "18h00 => 18h59", "19h00 => 19h59"
                     , "20h00 => 20h59", "21h00 => 21h59", "22h00 => 22h59", "23h00 => 23h59"
            ];
            for(var i=0;i<accidents.length;i++){
                var a = accidents[i];
                var tmp={};
                tmp.crash_date=a.date;
                tmp.coordinates={
                    "latitude":a.location.coordinates[0],
                    "longitude":a.location.coordinates[1]
                };
                tmp.day_of_week = weekday[a.date.getDay()];
                tmp.time=hour[accidents[i].date.getHours()-1];
                tmp.trimestre=Math.floor((a.date.getMonth() / 3) + 1);
                tmp.semestre=Math.floor((a.date.getMonth() / 6) + 1);
                result.push(tmp);
            }
            response.json({data: result, code: 1});
        }
    });;
    /*
    var accidents = [];
    accidents.push({
        "crash_date": "2014-06-20T00:00:00",
        "day_of_week": "Friday",
        "coordinates": {
            "latitude": "37.1588544",
            "longitude": "9.776710900000012"
        },
        "time": "5:00 PM to 5:59 PM"
    });
    response.json({data: accidents, code: 1});
    */
};

function statAccidentFilter(request, response) {
    var token = userController.isAuthorized(request, response, ["admin", "APCR"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    var filter = {};
    if(request.params.filter=='corporels'){
        filter.degats_corporels=true;
    }
    else if(request.params.filter=='blesses'){
        filter.injuriesNumber= { $gt: 0 };
    }
    else if(request.params.filter=='mortels'){
        filter.deathsNumber = {$gt:0};
    }
    else if(request.params.filter=='physique'){
        filter.degats_physiques= {$gt:0};
    }
    else if(request.params.filter=='sans'){
        filter={degats_corporels:false, degats_physiques:0};
    }
    else{
        console.error('Not able to query b/c:');
        response.json({message: 'error', code: -1});
        return;
    }
    Accident.find(filter, function (error, accidents) {
        if (error) {
            console.error('Not able to remove Accident b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else{
            var result = [];
            var weekday = new Array(7);
            weekday[0]=  "Dimanche";
            weekday[1] = "Lundi";
            weekday[2] = "Mardi";
            weekday[3] = "Mercredi";
            weekday[4] = "Jeudi";
            weekday[5] = "Vendredi";
            weekday[6] = "Samedi";
            var hour=["00h00 => 00h59", "01h00 => 01h59", "02h00 => 02h59", "03h00 => 03h59", "04h00 => 04h59"
                , "05h00 => 05h59", "06h00 => 06h59", "07h00 => 07h59", "08h00 => 08h59", "09h00 => 09h59"
                , "10h00 => 10h59", "11h00 => 11h59", "12h00 => 12h59", "13h00 => 13h59", "14h00 => 14h59"
                , "15h00 => 15h59", "16h00 => 16h59", "17h00 => 17h59", "18h00 => 18h59", "19h00 => 19h59"
                , "20h00 => 20h59", "21h00 => 21h59", "22h00 => 22h59", "23h00 => 23h59"
            ];
            for(var i=0;i<accidents.length;i++){
                var a = accidents[i];
                var tmp={};
                tmp.crash_date=a.date;
                tmp.coordinates={
                    "latitude":a.location.coordinates[0],
                    "longitude":a.location.coordinates[1]
                };
                tmp.day_of_week = weekday[a.date.getDay()];
                tmp.time=hour[accidents[i].date.getHours()-1];
                tmp.trimestre=Math.floor((a.date.getMonth() / 3) + 1);
                tmp.semestre=Math.floor((a.date.getMonth() / 6) + 1);
                result.push(tmp);
            }
            response.json({data: result, code: 1});
        }
    });
};

function dashbordStat(request, response) {
    var token = userController.isAuthorized(request, response, ["admin", "APCR"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Accident.find({}, function (error, accidents20) {
        User.find({}, function (error, users20) {
            Accident.find().count(function(err, countAccident){
                User.find().count(function(err, countUser){
                    Notification.find({}, function (error, notification) {

                    }).limit(10);
                });
            });
            response.json({data: result, code: 1});
        }).sort({'created': -1}).limit(20);
    }).sort({'date': -1}).limit(20);
};


module.exports = {
    addAccident: addAccident,
    updateAccident: updateAccident,
    removeAccident: removeAccident,
    listAccident: listAccident,
    findAccidentById: findAccidentById,
    statAccident:statAccident,
    statAccidentFilter:statAccidentFilter,
    dashbordStat:dashbordStat
};