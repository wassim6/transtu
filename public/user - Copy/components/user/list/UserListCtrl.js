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
        });
    };

});

