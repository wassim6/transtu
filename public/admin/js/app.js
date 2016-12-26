/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngResource",
    "datatables",
    "angular-confirm",
    "uiGmapgoogle-maps",
    "naif.base64",
    "ui.select",
    "ngAnimate",
    "toaster",
    "angular-jwt",
    "ngProgress",
    "ngMaterial",
    "ngFlash",
    "ui-notification",
    "ngStorage",
    "vsGoogleAutocomplete",
    "oitozero.ngSweetAlert",
    "rzModule",
    "yaru22.angular-timeago",
    "ngMaterial",
    "lfNgMdFileInput",
    "easypiechart"
]);

MetronicApp.constant('urlService', 'http://localhost\\:8080/api/');
//MetronicApp.constant('urlService', 'http://vynd-api-6.azurewebsites.net/');
MetronicApp.constant('itemPerPage', 10);

MetronicApp.directive('autoComplete', function ($timeout) {
    return function (scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    iElement.trigger('input');
                }, 0);
            }
        });
    };
});

MetronicApp.directive("confirmButton", function ($document, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var buttonId, html, message, nope, title, yep;

            buttonId = Math.floor(Math.random() * 10000000000);

            attrs.buttonId = buttonId;

            message = attrs.message || "Ete vous sure ?";
            yep = attrs.yes || "Supprimer";
            nope = attrs.no || "Annuler";
            title = attrs.title || "Confirmez";

            html = "<div id=\"button-" + buttonId + "\">\n  <span class=\"confirmbutton-msg\">" + message + "</span><br>\n	<button class=\"confirmbutton-yes btn btn-danger\">" + yep + "</button>\n	<button class=\"confirmbutton-no btn\">" + nope + "</button>\n</div>";

            element.popover({
                content: html,
                html: true,
                trigger: "manual",
                title: title,
                placement: "top"
            });

            return element.bind('click', function (e) {
                var dontBubble, pop;
                dontBubble = true;

                e.stopPropagation();

                element.popover('show');

                pop = $("#button-" + buttonId);

                pop.closest(".popover").click(function (e) {
                    if (dontBubble) {
                        e.stopPropagation();
                    }
                });

                pop.find('.confirmbutton-yes').click(function (e) {
                    dontBubble = false;

                    var func = $parse(attrs.confirmButton);
                    func(scope);
                });

                pop.find('.confirmbutton-no').click(function (e) {
                    dontBubble = false;

                    $document.off('click.confirmbutton.' + buttonId);

                    element.popover('hide');
                });

                $document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function () {
                    $document.off('click.confirmbutton.' + buttonId);
                    element.popover('hide');
                });
            });
        }
    };
});

MetronicApp.value('AuthenticatedUser', {login:false});

MetronicApp.run(function ($rootScope, $state, $location, $http, $resource, jwtHelper) {
    $rootScope.$on('$stateChangeSuccess', function (event, next) {
        if ($rootScope.AuthenticatedUser != null) {
            if (jwtHelper.isTokenExpired($rootScope.AuthenticatedUser.token)) {
                $rootScope.AuthenticatedUser = null;
                $state.go('login');
                $location.path("/login");
            }

        }
        else {
            var user = getCookie('tmp');
            var login = getCookie('login');
            if (typeof user == 'undefined' || user == null || user == '' ||
                typeof login == 'undefined' || login == null || login == '') {
                $rootScope.AuthenticatedUser = null;
                $state.go('login');
                $location.path("/login");
            }
            else {
                var tokenPayload = jwtHelper.decodeToken(user);
                $rootScope.AuthenticatedUser = {
                    login: login,
                    token: user,
                    role: tokenPayload.role
                };
                $http.defaults.headers.common['x-access-token'] =  $rootScope.AuthenticatedUser.token;
            }
        }

    });
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 50 //1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', 'urlService', function ($scope, $rootScope, urlService) {

    $scope.BaseUrl = urlService;
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components

    });

    //$scope.headerShow=true;

}]);

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', function ($timeout, $interval, $scope, $http, $rootScope, $state, $stateParams, $location, urlService, $resource) {

    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
        $resource(urlService + 'user/myprofile').get({}, function (response) {
            $scope.userHeader = response.data;
        });
    });
    $timeout(function () {
        $resource(urlService + 'user/myprofile').get({}, function (response) {
            $scope.userHeader = response.data;
        });
    }, 1000);

    $timeout(function () {
        $resource(urlService + 'notification/navbar').get({}, function (res) {
            $scope.headerNotification5 = res.notification5;
            $scope.headerNotificationNotRead = res.notificationNotRead;
        });
    }, 1000);

    $interval(function () {
        $resource(urlService + 'notification/navbar').get({}, function (res) {
            $scope.headerNotification5 = res.notification5;
            $scope.headerNotificationNotRead = res.notificationNotRead;
        });
    }, 10000);


    $scope.logOut = function () {
        var urlS = 'http://localhost:8080/api/';
        $http.get(urlS + 'user/logout').then(function(response) {
            $rootScope.AuthenticatedUser = null;
            setCookie('tmp', null, null);
            setCookie('login', null, null);
            $state.go('login');
            $location.path("/login");
        }, function (response) {
            $rootScope.AuthenticatedUser = null;
            setCookie('tmp', null, null);
            setCookie('login', null, null);
            $state.go('login');
            $location.path("/login");
        });


    };

});

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);


/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);


/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}