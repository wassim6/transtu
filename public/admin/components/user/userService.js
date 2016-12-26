'use strict';

MetronicApp.factory('UserService', function ($resource, urlService) {


    var service = {};

    service.GetListUser = GetListUser;
    service.FindById = FindById;
    service.BlockUser = BlockUser;
    service.UnblockUser = UnblockUser;
    service.GetActivityLog = GetActivityLog;
    service.AddAdmin = AddAdmin;
    service.MyProfile = MyProfile;
    service.MyActivityLog = MyActivityLog;
    service.EditImage = EditImage;
    service.EditInfo = EditInfo;
    service.EditPass = EditPass;
    service.EditRole = EditRole;

    return service;


    function GetListUser() {
        return $resource(urlService + 'user/list');
    }
    function FindById() {
        return $resource(urlService + 'user/find/:id', {id: '@id'});
    }
    function BlockUser() {
        return $resource(urlService + 'user/block');
    }
    function UnblockUser() {
        return $resource(urlService + 'user/unblock');
    }
    function GetActivityLog() {
        return $resource(urlService + 'user/activitylog/:id', {id: '@id'});
    }
    function AddAdmin() {
        return $resource(urlService + 'admin/register');
    }
    function MyProfile() {
        return $resource(urlService + 'user/myprofile');
    }
    function MyActivityLog() {
        return $resource(urlService + 'user/myactivitylog');
    }
    function EditImage() {
        return $resource(urlService + 'user/editimage');
    }
    function EditInfo() {
        return $resource(urlService + 'user/editinfo');
    }
    function EditPass() {
        return $resource(urlService + 'user/editpass');
    }
    function EditRole() {
        return $resource(urlService + 'user/editrole');
    }


});