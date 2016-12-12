var User = require('../models/user.js');
var ActivityLog = require('../models/activityLog.js');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator');
var passwordHash = require('password-hash');
var fs = require('fs');


function registerUser(request, response) {
    if (typeof(request.body.firstName) == 'undefined' || typeof(request.body.lastName) == 'undefined' || typeof(request.body.email) == 'undefined' || typeof(request.body.password) == 'undefined') {
        response.json({message: 'error', code: -1});
        return;
    }
    if (!validator.isEmail(request.body.email, {require_tld: false})) {
        response.json({message: 'error:check your email', code: -2});
        return;
    }
    if (request.body.password.length < 4) {
        response.json({message: 'error:password too weak', code: -3});
        return;
    }
    if(typeof (request.body.gsm)=='undefined')
        request.body.gsm=null;
    var newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: passwordHash.generate(request.body.password),
        role: 'user',
        gsm:request.body.gsm
    };

    var userNew = new User(newUser);

    userNew.save(function (error) {
        if (error) {
            console.error('Not able to create user b/c:', error);
            response.json({message: 'error, user already exist', code: -3});
        }
        else {
            response.json({message: 'user successfully created', code: 1});
        }
    });
};

function authetificationUser(request, response) {
    if (typeof(request.body.email) == 'undefined' || typeof(request.body.password) == 'undefined') {
        response.json({message: 'error', code: -1});
        return;
    }
    User.findOne({email: request.body.email}, function (err, user) {
        if (err) throw err;
        if (user != null) {
            if (!passwordHash.verify(request.body.password, user.password)) {
                response.json({message: 'error', code: -1});
                return;
            }
            if (user.role != 'user') {
                response.json({message: 'unauthorised', code: -1});
                return;
            }
            if (user.isBlocked) {
                response.json({message: 'blocked', code: -2});
                return;
            }
            var payload = {id: user._id, role: user.role, firstName: user.firstName};
            var token = jwt.sign(payload, 'ilovesmeanstack', {
                expiresIn: 686400 // expires in 24 hours
            });
            AddActivityLog(user._id, 'logIn', request.headers['user-agent']);
            response.json({
                code: 1,
                message: 'succes',
                token: token,
                login: payload.firstName
            });

        }
        else
            response.json({message: 'error', code: -1});
    }).select('+password');
};

function registerAdmin(request, response) {
    var token = isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    if (typeof(request.body.role) == 'undefined'  || typeof(request.body.firstName) == 'undefined' || typeof(request.body.lastName) == 'undefined' || typeof(request.body.email) == 'undefined' || typeof(request.body.password) == 'undefined') {
        response.json({message: 'error', code: -1});
        return;
    }
    if (!validator.isEmail(request.body.email, {require_tld: false})) {
        response.json({message: 'error:check your email', code: -2});
        return;
    }
    if (request.body.password.length < 4) {
        response.json({message: 'error:password too weak', code: -3});
        return;
    }
    if(typeof (request.body.gsm)=='undefined')
        request.body.gsm=null;
    var newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        role: request.body.role,
        password: passwordHash.generate(request.body.password),
        role: 'admin',
        gsm:request.body.gsm
    };

    var userNew = new User(newUser);
    userNew.save(function (error) {
        if (error) {
            console.error('Not able to create admin b/c:', error);
            response.json({message: 'error, user already exist', code: -4});
        }
        else {
            response.json({message: 'admin successfully created', code: 1});
        }
    });
};

function authetificationAdmin(request, response) {
    if (typeof(request.body.email) == 'undefined' || typeof(request.body.password) == 'undefined') {
        response.json({message: 'error', code: -1});
        return;
    }
    User.findOne({email: request.body.email}, function (err, user) {
        if (err) throw err;
        if (user != null) {
            if (!passwordHash.verify(request.body.password, user.password)) {
                response.json({message: 'error', code: -1});
                return;
            }
            if (user.role != 'admin') {
                response.json({message: 'unauthorised', code: -1});
                return;
            }
            if (user.isBlocked) {
                response.json({message: 'blocked', code: -2});
                return;
            }
            var payload = {id: user._id, role: user.role, firstName: user.firstName};
            var token = jwt.sign(payload, 'ilovesmeanstack', {
                expiresIn: 686400 // expires in 24 hours
            });
            AddActivityLog(user._id, 'logIn', request.headers['user-agent']);
            response.json({
                code: 1,
                message: 'succes',
                token: token,
                login: payload.firstName
            });

        }
        else
            response.json({message: 'error', code: -1});
    }).select('+password');
};

function listUser(request, response) {
    var token = isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.find({}, function (error, users) {
        if (error) {
            console.error('Not able to get users b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else
            response.json({data: users, code: 1});
    }).sort('-created');
    // .populate('accident', '-user').sort('-created');//select('+password')
};

function findUserById(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.findById(request.params.id, function (error, user) {
        if (error) {
            console.error('Could not retrieve user b/c:', error);
            response.json({message: 'error: user not found', code: -1});
        }
        else
            response.json({data: user, code: 1});
    }).populate("accident", '-user');
}

function logOut(request, response) {
    var token = isAuthorized(request, response);
    AddActivityLog(token.id, 'logOut', request.headers['user-agent']);
    response.json({code: 1, message: 'succes'});
}

function blockUser(request, response) {
    var token = isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.update({
        "_id": request.body.id
    }, {
        isBlocked: true
    }, function (err, model) {
        if (err) {
            console.error('Not able to edit User b/c:', error);
            response.json({message: 'error', code: -2});
        }
        else
            response.json({message: 'User successfully edited', code: 1});
    });
}

function unblockUser(request, response) {
    var token = isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.update({
        "_id": request.body.id
    }, {
        isBlocked: false
    }, function (err, model) {
        if (err) {
            console.error('Not able to edit User b/c:', error);
            response.json({message: 'error', code: -2});
        }
        else
            response.json({message: 'User successfully edited', code: 1});
    });
}

function findActivityLogByUser(request, response) {
    var token = isAuthorized(request, response, ["admin"]);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    ActivityLog.find({user: request.params.id}, function (error, activities) {
        if (error) {
            console.error('Not able to get acctivities log b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else
            response.json({data: activities, code: 1});
    }).sort('-date');
}

function myProfile(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.findById(token.id, function (error, user) {
        if (error) {
            console.error('Could not retrieve user b/c:', error);
            response.json({message: 'error: user not found', code: -1});
        }
        else
            response.json({data: user, code: 1});
    }).populate("accident", '-user');
}

function myActivityLog(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    ActivityLog.find({user: token.id}, function (error, activities) {
        if (error) {
            console.error('Not able to get acctivities log b/c:', error);
            response.json({message: 'error', code: -1});
        }
        else
            response.json({data: activities, code: 1});
    }).sort('-date');
}

function editProfileImage(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.findById(token.id,function(error, user) {
        if (error){
            console.error('Could not retrieve user b/c:', user);
            response.status(400).send('error img');
        }
        else
        {
            if(user.profileImageURL!='default.jpg'){
                fs.unlinkSync('public/imgs/users/'+user.profileImageURL);
            }
            var bitmap = new Buffer(request.body.data, 'base64');
            var uri = Math.round(+new Date()/1000);
            fs.writeFile('public/imgs/users/'+uri+'.'+request.body.type.split('/')[1], bitmap, function(err) {
                if(err){
                    console.error('Could not save image b/c:', user);
                    response.status(400).send('error img 2');
                }
                else{
                    user.profileImageURL=uri+'.'+request.body.type.split('/')[1];
                    user.save(function(error) {
                        if (error) {
                            console.error('Not able to update user b/c:', error);
                            response.status(400).json('error');
                        }
                        else{
                            response.json({message: 'User successfully updated', code:1, data:user});
                        }
                    });
                }
            });
        }
    });
}

function editInfo(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.findById(token.id,function(error, user) {
        if (error){
            console.error('Could not retrieve user b/c:', user);
            response.status(400).send('error img');
        }
        else
        {
            if (typeof(request.body.firstName) == 'undefined' || typeof(request.body.lastName) == 'undefined' || typeof(request.body.email) == 'undefined') {
                response.json({message: 'error', code: -1});
                return;
            }
            if (!validator.isEmail(request.body.email, {require_tld: false})) {
                response.json({message: 'error:check your email', code: -2});
                return;
            }
            user.firstName=request.body.firstName;
            user.lastName=request.body.lastName;
            user.email=request.body.email;
            user.save(function(error) {
                if (error) {
                    console.error('Not able to update user b/c:', error);
                    response.status(400).json('error');
                }
                else{
                    response.json({message: 'User successfully updated', code:1, data:user});
                }
            });
        }
    });
}

function editPass(request, response) {
    var token = isAuthorized(request, response);
    if (typeof(token) == 'undefined' || token == -1)
        return;
    User.findById(token.id,function(error, user) {
        if (error){
            console.error('Could not retrieve user b/c:', user);
            response.status(400).send('error img');
        }
        else
        {
            if (typeof(request.body.oldPass) == 'undefined' || typeof(request.body.newPass  ) == 'undefined' || typeof(request.body.newPass2) == 'undefined') {
                response.json({message: 'error', code: -1});
                return;
            }
            if (!passwordHash.verify(request.body.oldPass, user.password)) {
                response.json({message: 'error ', code: -2});
                return;
            }
            if (request.body.newPass.length < 4) {
                response.json({message: 'error:password too weak', code: -3});
                return;
            }
            user.password=passwordHash.generate(request.body.newPass);
            user.save(function(error) {
                if (error) {
                    console.error('Not able to update user b/c:', error);
                    response.status(400).json('error');
                }
                else{
                    response.json({message: 'User successfully updated', code:1, data:user});
                }
            });
        }
    }).select('+password');
}

/* Utils */

function AddActivityLog(userId, type, device) {
    var activity = new ActivityLog({
        device: device,
        type: type,
        user : userId
    });
    activity.save();
}

function isAuthorized(req, res, role) {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        try {
            var decoded = jwt.verify(token, 'ilovesmeanstack');
            if (typeof(role) != 'undefined' && role.length > 0) {
                var isOk = false;
                for (var i = 0; i < role.length; i++) {
                    //console.log(role+"  "+decoded.role)
                    if (role[i] == decoded.role) {
                        return decoded;
                    }
                }
                res.json({code: -1, message: 'error: unauthorised.'});
                return -1;
            }
            else
                return decoded;
        } catch (err) {
            res.json({code: -1, message: 'Failed to authenticate token.'});
            return -1;
        }
    } else {
        // if there is no token
        res.json({code: -1, message: 'No token provided.'});
        return -1;
    }
};


module.exports = {
    registerUser: registerUser,
    authetificationUser: authetificationUser,
    registerAdmin: registerAdmin,
    authetificationAdmin: authetificationAdmin,
    isAuthorized: isAuthorized,
    listUser: listUser,
    findUserById:findUserById,
    logOut:logOut,
    blockUser:blockUser,
    unblockUser:unblockUser,
    findActivityLogByUser:findActivityLogByUser,
    myProfile:myProfile,
    myActivityLog:myActivityLog,
    editProfileImage:editProfileImage,
    editInfo:editInfo,
    editPass:editPass
};