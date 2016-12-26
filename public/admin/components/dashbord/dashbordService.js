'use strict';

MetronicApp.factory('DashbordService', function ($resource, urlService) {


    var service = {};

    service.DashbordStat = DashbordStat;
    service.DashbordDegat = DashbordDegat;
    service.NotificationNavbar = NotificationNavbar;
    service.MyNotification = MyNotification;//liste
    //service.FindById = FindById;

    return service;


    function DashbordStat() {
        return $resource(urlService + 'dashbord/stat');
    }
    function DashbordDegat() {
        return $resource(urlService + 'dashbord/degat');
    }
    function NotificationNavbar() {
        return $resource(urlService + 'notification/navbar');
    }
    function MyNotification() {
        return $resource(urlService + 'notification/myNotification');
    }

    /*
    function FindById() {
        return $resource(urlService + 'accident/find/:ID', {ID: '@ID'});
    }
    */


});

