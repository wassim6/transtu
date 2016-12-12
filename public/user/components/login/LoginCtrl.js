'use strict';

MetronicApp.controller('LoginCtrl', function ($rootScope, $scope, $http, $timeout, LoginService, toaster, $location, $state, ngProgressFactory) {


    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('3px');
    $scope.progressbar.setColor("#5BB6BD");

    
    $scope.disable = false;
    if ($rootScope.AuthenticatedUser) {
        $state.go('dashboard');
        $location.path("/dashboard");
    }
    $scope.loginGo = function () {
        $scope.progressbar.start();
        $scope.disable = true;
        LoginService.Login().save({
            "email": $scope.login,
            "password": $scope.password

        }, function (res) {
            var code = res.code;
            if (code == 1) {
                var response = res;
                $scope.disable = false;
                $scope.progressbar.complete();
                toaster.success("success", "Welcome");

                $rootScope.AuthenticatedUser = {
                    login: response.login,
                    token: response.token
                };
                setCookie('tmp', response.token, 14);
                setCookie('login', response.login, 14);

                $http.defaults.headers.common['x-access-token'] =  $rootScope.AuthenticatedUser.token;
                $state.go('dashboard');
                $location.path("/dashboard");
            } else {
                $scope.disable = false;
                $scope.progressbar.complete();
                toaster.error("error", "login or password incorect");
            }
        }, function (e) {
            $scope.disable = false;
            $scope.progressbar.complete();
            toaster.error("error", "login or password incorect");
        });
    };


});