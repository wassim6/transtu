'use strict';

MetronicApp.controller('LoginCtrl', function ($rootScope, $scope, $http, jwtHelper, $timeout, LoginService, toaster, $location, $state, ngProgressFactory) {


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
                var tokenPayload = jwtHelper.decodeToken(response.token);
                $rootScope.AuthenticatedUser = {
                    login: response.login,
                    token: response.token,
                    role: tokenPayload.role
                };
                setCookie('tmp', response.token, 14);
                setCookie('login', response.login, 14);

                $http.defaults.headers.common['x-access-token'] =  $rootScope.AuthenticatedUser.token;
                $rootScope.$broadcast('$includeContentLoaded');
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