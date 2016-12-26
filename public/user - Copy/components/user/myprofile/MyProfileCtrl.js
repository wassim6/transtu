'use strict';

MetronicApp.controller('MyProfileCtrl', function ($rootScope, $scope, $http, $stateParams, $location, SweetAlert, $timeout, UserService, DTOptionsBuilder, DTColumnBuilder, toaster,  $modal) {
    
    UserService.MyProfile().get({}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.user = res.data;
    });
    UserService.MyActivityLog().get({}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.logs = res.data;
    });

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'desc']).withOption('lengthMenu', [50, 100, 150, 200]);


});

