var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var apiRouter = express.Router();

var userController = require('../controllers/user-controller');
var accidentController = require('../controllers/accident-controller');


apiRouter.post('/user/register', userController.registerUser);
apiRouter.post('/user/login', userController.authetificationUser);
apiRouter.get('/user/list', userController.listUser);
apiRouter.get('/user/find/:id', userController.findUserById);
apiRouter.get('/user/logout', userController.logOut);
apiRouter.post('/user/block', userController.blockUser);
apiRouter.post('/user/unblock', userController.unblockUser);
apiRouter.get('/user/activitylog/:id', userController.findActivityLogByUser);
apiRouter.get('/user/myprofile', userController.myProfile);
apiRouter.get('/user/myactivitylog', userController.myActivityLog);
apiRouter.post('/user/editimage', userController.editProfileImage);
apiRouter.post('/user/editinfo', userController.editInfo);
apiRouter.post('/user/editpass', userController.editPass);


apiRouter.post('/admin/register', userController.registerAdmin);
apiRouter.post('/admin/login', userController.authetificationAdmin);


apiRouter.post('/accident/add', accidentController.addAccident);
apiRouter.post('/accident/update', accidentController.updateAccident);
apiRouter.post('/accident/remove', accidentController.removeAccident);
apiRouter.post('/accident/list', accidentController.listAccident);
apiRouter.get('/accident/find/:id', accidentController.findAccidentById);
apiRouter.get('/accident/stat', accidentController.statAccident);
apiRouter.get('/accident/stat/:filter', accidentController.statAccidentFilter);



module.exports = apiRouter;
