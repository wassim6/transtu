'use strict';

MetronicApp.factory('AccidentService', function ($resource, urlService) {


    var service = {};

    service.GetListAccident = GetListAccident;
    service.FindById = FindById;
    service.AddAccident= AddAccident;
    service.RemoveAccident = RemoveAccident;
    service.EditAccident = EditAccident;
    service.StatAccident = StatAccident;
    service.StatAccidentFilter = StatAccidentFilter;

    return service;


    function GetListAccident() {
        return $resource(urlService + 'accident/list');
    }
    function FindById() {
        return $resource(urlService + 'accident/find/:ID', {ID: '@ID'});
    }
    function AddAccident() {
        return $resource(urlService + 'accident/add');
    }
    function RemoveAccident() {
        return $resource(urlService + 'accident/remove');
    }
    function EditAccident() {
        return $resource(urlService + 'accident/update');
    }
    function StatAccident() {
        return $resource(urlService + 'accident/stat');
    }
    function StatAccidentFilter() {
        return $resource(urlService + 'accident/stat/:filter', {filter: '@filter'});
    }


});

