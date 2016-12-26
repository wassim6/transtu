var User = require('../models/user.js');
var Accident = require('../models/accident.js');
var Notification = require('../models/notification.js');
var nodemailer = require('nodemailer');


var userController = require('./user-controller');

function addNotification( accident) {
    var query={};
    query = {
        $or:[
            {
                'role':'admin'
            }
            ,
            {
                'role':'responsable'
            }
        ]

    };
    User.find(query, function(error, users){
        query.lastLocation={
                $near : {
                    $geometry : {
                        type : "Point",
                        coordinates : [accident.location.coordinates[0], accident.location.coordinates[1]]
                    },
                    $maxDistance : 1000*10 // request.body.rayon //10 Km
                }
        };
        User.find(query, function(error, users2){
            if(typeof (users2)=='undefined')
                users2=[];
            var result = users.concat(users2);
            //Send mail to admin and APCR

            var array=[], userMailList='';
            for(var i=0; i<result.length; i++){
                array.push({
                    user: result[i]._id,
                    accident: accident._id
                });
                if(i<result.length-1)
                    userMailList+=result[i].email+', ';
                else
                    userMailList+=result[i].email;
            }
            var bodyMail='<h1>Un accident à été signalé près de vous</h1>';
            bodyMail+='<p>qsd qsd qsd qsd sqd</p>'
            var transporter = nodemailer.createTransport('smtps://falloussaf%40gmail.com:djangospark6@smtp.gmail.com');
            var mailOptions = {
                from: '"TRANSTU" <no-reply@transtu.tn>', // sender address
                to: userMailList, // list of receivers
                subject: 'Notification - accident ajouté', // Subject line
                text: 'Hello world ?', // plaintext body
                html: bodyMail // html body
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log("mail not send: "+error);
                }
                console.log('Message sent: ' + info.response);
            });

            //Add notification
            Notification.create(array, function(error) {
                if (error) {
                    console.error('Not able to create Notification b/c:', error);
                }
                else{
                    console.log("Notification send");
                }
            });
        });
    });
};


function notificationNavBar(request, response) {
    var token = userController.isAuthorized(request, response, []);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Notification.find({user:token.id}, function (error, notification5) {
        Notification.find({isRead:false, user:token.id}).count( function (error, notificationNotRead) {
            response.json({
                notification5: notification5,
                notificationNotRead:notificationNotRead,
                code: 1
            });
        });
    }).sort({'date': -1}).populate("user").populate("accident").limit(5);
};

function myNotification(request, response) {
    var token = userController.isAuthorized(request, response, []);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    Notification.find({user:token.id}, function (error, notifications) {
        response.json({
            notifications: notifications,
            code: 1
        });
    }).sort({'date': -1}).populate("user").populate("accident");
};

function readNotificationAccident(userId, accident) {
    Notification.update({
        "user": userId,
        "accident": accident._id
    }, {
        isRead:true
    }, function (err, model) {
        if (err) {
            return null;
        }
        else
            return 1;
    });
};

module.exports = {
    addNotification:addNotification,
    notificationNavBar:notificationNavBar,
    myNotification:myNotification,
    readNotificationAccident:readNotificationAccident
};

