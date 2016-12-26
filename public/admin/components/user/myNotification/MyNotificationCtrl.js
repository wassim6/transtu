'use strict';

MetronicApp.controller('MyNotificationCtrl', function ($rootScope, $scope, DashbordService, $location,
                                                       SweetAlert, $timeout, UserService, DTOptionsBuilder, DTColumnBuilder,
                                                       toaster,  $modal, AccidentService) {

    DashbordService.NotificationNavbar().get({}, function (res) {
        $scope.notificationNotRead = res.notificationNotRead;
    });

    DashbordService.MyNotification().get({}, function (res) {
        //console.log(res);
        $scope.notifications = res.notifications;
    });

    $scope.markAsRead = function (id, index) {
        var accident = AccidentService.FindById().get({ID: id}, function () {
            $scope.notifications[index].isRead=true;
            toaster.success("success", "Notification marqué comme lue");
        });
    };


    $scope.open = function (id, size, index) {
        var accident = AccidentService.FindById().get({ID: id}, function () {
            $scope.notifications[index].isRead=true;
            toaster.success("success", "Notification marqué comme lue");
            //console.log(accident);
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return accident;
                    }
                }
            });
        });
    };


});

function ModalInstanceCtrl($scope, $modalInstance, $timeout , items, AccidentService, toaster, $location) {
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
    $scope.detailUser = function(){
        $modalInstance.dismiss('cancel');
        $location.path('/user/detail/'+$scope.item.user._id);
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

}


