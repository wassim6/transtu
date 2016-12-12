'use strict';

MetronicApp.controller('AccidentAddedCtrl', function ($rootScope, $scope, $http, $stateParams, $location, $timeout, UserService, AccidentService, DTOptionsBuilder, DTColumnBuilder, toaster,  $modal, SweetAlert) {

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

    $scope.delete = function (id, index) {
        AccidentService.RemoveAccident().save({
            "id":id
        }, function (res) {
            if(res.code>0) {
                $scope.user.accident.splice(index, 1);
                toaster.success("success", "Accident supprimé");
            }
            else
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        }, function (err) {
            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        });
    };
    $scope.open = function (id, size, index) {
        var accident = AccidentService.FindById().get({ID: id}, function () {
            //console.log(accident);
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return accident;
                    },
                    index: function () {
                        return index;
                    }
                }
            });
            modalInstance.result.then(function (index) {
                $scope.accidents.splice(index, 1);
            }, function () {

            });
        });
    };

});

function ModalInstanceCtrl($scope, $modalInstance, $timeout , items, AccidentService, toaster, index, $location) {
    $scope.item = items.data;
    if($scope.item.degats_physiques==0)
        $scope.item.degats_physiques="Aucun dégat";
    else if($scope.item.degats_physiques==1)
        $scope.item.degats_physiques="Léger dégat";
    else
        $scope.item.degats_physiques="Grave dégat";

    $scope.render=false;

    $timeout(initMap, 600);

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.editAccident = function () {
        $modalInstance.dismiss('cancel');
        $location.path('/accident/edit/'+$scope.item._id);
    };
    $scope.delete = function (id) {
        AccidentService.RemoveAccident().save({
            "id":id
        }, function (res) {
            if(res.code>0) {
                toaster.success("success", "Accident supprimé");
                $modalInstance.close(index);

                //$scope.accidents.splice(index, 1);
                //$uibModalInstance.close(id);
                //$modalInstance.dismiss('cancel');
            }
            else
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        }, function (err) {
            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        });
    };


    function initMap() {
        $scope.render=true;
        $scope.a = {};
        $scope.a.latitude = items.data.location.coordinates[0];
        $scope.a.longitude = items.data.location.coordinates[1];
        $scope.map = {center: {latitude: $scope.a.latitude, longitude: $scope.a.longitude}, zoom: 11};
        $scope.optionsMap = {scrollwheel: true};
        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.a.latitude,
                longitude: $scope.a.longitude
            },
            options: {draggable: false}
        };
    };

};


