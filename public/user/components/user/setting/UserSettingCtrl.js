'use strict';

MetronicApp.controller('UserSettingCtrl', function ($scope,
                                                    $stateParams,
                                                    $location,
                                                    $timeout,
                                                    UserService,
                                                    DTOptionsBuilder,
                                                    DTColumnBuilder,
                                                    toaster,
                                                    $modal,
                                                    SweetAlert) {

    var userId = $stateParams.id;
    $scope.userId = userId;

    UserService.FindById().get({id: userId}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.user = res.data;
    });

    $scope.block = function () {
        SweetAlert.swal({
                title: "Etes vous sûr ?",
                text: "Est vous sûre de Bloker ce utilisateur ?!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Blocker",
                cancelButtonText: "Annuler",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    UserService.BlockUser().save({
                        "id":userId
                    }, function (res) {
                        if(res.code>0) {
                            $scope.user.isBlocked=!$scope.user.isBlocked;
                            SweetAlert.swal("Blocker!", "Utilisateur Blocké", "success");
                        }
                        else
                            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    }, function (err) {
                        toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    });
                }
            });
    };
    $scope.unblock = function () {
        SweetAlert.swal({
                title: "Etes vous sûr ?",
                text: "Est vous sûre de Débloker ce utilisateur ?!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Déblocker",
                cancelButtonText: "Annuler",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    UserService.UnblockUser().save({
                        "id":userId
                    }, function (res) {
                        if(res.code>0) {
                            $scope.user.isBlocked=!$scope.user.isBlocked;
                            SweetAlert.swal("Déblocké!", "Utilisateur Déblocké", "success");
                        }
                        else
                            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    }, function (err) {
                        toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    });
                }
            });
    };


});



/*
'use strict';

MetronicApp.controller('UserSettingCtrl', function ($rootScope, $scope, $http, $stateParams, $location, $timeout, UserService, DTOptionsBuilder, DTColumnBuilder, toaster,  $modal) {

    var userId = $stateParams.id;
    $scope.userId = userId;

    UserService.FindById().get({id: userId}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.user = res.data;
    });

    $scope.block = function () {
        SweetAlert.swal({
                title: "Etes vous sûr ?",
                text: "Est vous sûre de Bloker ce utilisateur ?!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Blocker",
                cancelButtonText: "Annuler",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    UserService.BlockUser().save({
                        "id":userId
                    }, function (res) {
                        if(res.code>0) {
                            $scope.user.isBlocked=!$scope.user.isBlocked;
                            SweetAlert.swal("Blocker!", "Utilisateur Blocké", "success");
                        }
                        else
                            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    }, function (err) {
                        toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    });
                }
            });
    };
    $scope.unblock = function () {
        SweetAlert.swal({
                title: "Etes vous sûr ?",
                text: "Est vous sûre de Débloker ce utilisateur ?!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Déblocker",
                cancelButtonText: "Annuler",
                closeOnConfirm: false,
                closeOnCancel: true },
            function(isConfirm){
                if (isConfirm) {
                    UserService.UnblockUser().save({
                        "id":userId
                    }, function (res) {
                        if(res.code>0) {
                            $scope.user.isBlocked=!$scope.user.isBlocked;
                            SweetAlert.swal("Déblocké!", "Utilisateur Déblocké", "success");
                        }
                        else
                            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    }, function (err) {
                        toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                    });
                }
            });
    };


});
*/
