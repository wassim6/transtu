'use strict';

MetronicApp.controller('UserListCtrl', function ($rootScope, $scope, $http, $timeout, UserService, DTOptionsBuilder, DTColumnBuilder, toaster,  $modal) {

    $scope.finish = true;

    var response = UserService.GetListUser().get({}, function () {
        $scope.users = response.data;
        $scope.finish = false;
    });

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [0, 'desc']).withOption('lengthMenu', [50, 100, 150, 200]);


    $scope.block = function (id, index) {
        UserService.BlockUser().save({
            "id":id
        }, function (res) {
            if(res.code>0) {
                $scope.users[index].isBlocked=!$scope.users[index].isBlocked;
                toaster.success("success", "Utilisateur blocker");
            }
            else
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        }, function (err) {
            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        });
    };

    $scope.unblock = function (id, index) {
        UserService.UnblockUser().save({
            "id":id
        }, function (res) {
            if(res.code>0) {
                $scope.users[index].isBlocked=!$scope.users[index].isBlocked;
                toaster.success("success", "Utilisateur déblocker");
            }
            else
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        }, function (err) {
            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        });
    };

    $scope.editRole = function (user, index) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                items: function () {
                    return user;
                },
                index: function () {
                    return index;
                }
            }
        });
        modalInstance.result.then(function (index) {
            //console.log(index);
            //$scope.accidents.splice(index, 1);
        }, function () {

        });
    };
});

function ModalInstanceCtrl($scope, $modalInstance, $timeout , items, toaster, index, $location, UserService) {
    $scope.item = items;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.edit = function () {
        UserService.EditRole().save({
            "id":items._id,
            "role":$scope.item.role
        }, function (res) {
            if(res.code>0) {
                toaster.success("success", "Modification enregistré");
                //$scope.item.index=index;
                $modalInstance.close($scope.item);
            }
            else
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        }, function (err) {
            toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
        });
    };
};



