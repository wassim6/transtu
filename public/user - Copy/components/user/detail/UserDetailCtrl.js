'use strict';

MetronicApp.controller('UserDetailCtrl', function ($rootScope, $scope, $http, $stateParams, $location, SweetAlert, $timeout, UserService, DTOptionsBuilder, DTColumnBuilder, toaster,  $modal) {

    $scope.finish = true;
    var userId = $stateParams.id;
    $scope.userId = userId;

    UserService.FindById().get({id: userId}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.user = res.data;
        $scope.finish = false;
    });
    UserService.GetActivityLog().get({id: userId}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.logs = res.data;
    });

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'desc']).withOption('lengthMenu', [50, 100, 150, 200]);


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

