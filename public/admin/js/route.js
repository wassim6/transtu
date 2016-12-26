/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");

    $stateProvider

    // Dashboard
    .state('dashboard', {
        url: "/dashboard.html",
        templateUrl: "../admin/components/dashbord/dashboard.html",
        data: {pageTitle: 'Admin Dashboard Template'},
        controller: "DashboardCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/dashbord/DashbordService.js',
                        '../admin/components/dashbord/DashboardCtrl.js'
                    ]
                });
            }]
        }

    })
    .state('accident/list', {
        url: "/accident/list",
        templateUrl: "../admin/components/accident/list/accidentList.html",
        data: {pageTitle: 'Accident List'},
        controller: "AccidentListCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/accident/list/AccidentListCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('accident/add', {
        url: "/accident/add",
        templateUrl: "../admin/components/accident/add/accidentAdd.html",
        data: {pageTitle: 'Ajouter un Accident'},
        controller: "AccidentAddCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/accident/add/AccidentAddCtrl.js'
                    ]
                });
            }]
        }

    })
    .state('accident/edit/:id', {
        url: "/accident/edit/:id",
        templateUrl: "../admin/components/accident/edit/accidentEdit.html",
        data: {pageTitle: 'Modifier accident'},
        controller: "AccidentEditCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/accident/edit/AccidentEditCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('accident/map', {
        url: "/accident/map",
        templateUrl: "../admin/components/accident/map/map.html",
        data: {pageTitle: 'Répartition géographique des accidents'},
        controller: "AccidentMapCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/accident/map/AccidentMapCtrl.js'
                    ]
                });
            }]
        }

    })
    .state('login', {
        url: "/login",
        templateUrl: "../admin/components/login/login.html",
        data: {pageTitle: 'Login'},
        controller: "LoginCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/login/loginService.js',
                        '../admin/components/login/LoginCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('user/list', {
    url: "/user/list",
    templateUrl: "../admin/components/user/list/userList.html",
    data: {pageTitle: 'User List'},
    controller: "UserListCtrl",
    resolve: {
        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'MetronicApp',
                insertBefore: '#ng_load_plugins_before',
                files: [
                    '../admin/components/user/userService.js',
                    '../admin/components/user/list/UserListCtrl.js'
                ]
            });
        }]
    }
})
    .state('user/detail/:id', {
        url: "/user/detail/:id",
        templateUrl: "../admin/components/user/detail/userDetail.html",
        data: {pageTitle: 'User Detail'},
        controller: "UserDetailCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/user/detail/UserDetailCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('user/accident/:id', {
        url: "/user/accident/:id",
        templateUrl: "../admin/components/user/accidentAdded/accidentAdded.html",
        data: {pageTitle: 'User Accident Added'},
        controller: "AccidentAddedCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/user/userService.js',
                        '../admin/components/user/accidentAdded/AccidentAddedCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('user/setting/:id', {
        url: "/user/setting/:id",
        templateUrl: "../admin/components/user/setting/setting.html",
        data: {pageTitle: 'User setting'},
        controller: "UserSettingCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/user/setting/UserSettingCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('user/add', {
        url: "/user/add",
        templateUrl: "../admin/components/user/add/add.html",
        data: {pageTitle: 'Ajouter un administrateur'},
        controller: "UserAddCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/user/add/UserAddCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('user/mynotification', {
        url: "/user/mynotification",
        templateUrl: "../admin/components/user/myNotification/mynotification.html",
        data: {pageTitle: 'Mes notifications'},
        controller: "MyNotificationCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/dashbord/DashbordService.js',
                        '../admin/components/user/myNotification/MyNotificationCtrl.js'
                    ]
                });
            }]
        }

    })

    .state('myprofile', {
        url: "/myprofile",
        templateUrl: "../admin/components/user/myprofile/myprofile.html",
        data: {pageTitle: 'Mon profile'},
        controller: "MyProfileCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/user/myprofile/MyProfileCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('myaccident', {
        url: "/myaccident",
        templateUrl: "../admin/components/user/myaccidentadded/myAccidentAdded.html",
        data: {pageTitle: 'Mes accident ajouté'},
        controller: "MyAccidentAddedCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/user/myAccidentAdded/MyAccidentAddedCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('mysetting', {
        url: "/mysetting",
        templateUrl: "../admin/components/user/mySetting/mySetting.html",
        data: {pageTitle: 'Paramètre du compte'},
        controller: "MySettingCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/user/userService.js',
                        '../admin/components/user/mySetting/MySettingCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat', {
        url: "/stat",
        templateUrl: "../admin/components/stat/stat.html",
        data: {pageTitle: 'Statistique'},
        controller: "StatCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/StatCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat/corporels', {
        url: "/stat/corporels",
        templateUrl: "../admin/components/stat/corporels/corporels.html",
        data: {pageTitle: 'Statistique des accidents corporels'},
        controller: "StatCorporelsCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/corporels/StatCorporelsCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat/blesses', {
        url: "/stat/blesses",
        templateUrl: "../admin/components/stat/blesses/blesses.html",
        data: {pageTitle: 'Statistique des accidents avec blessés'},
        controller: "StatBlessesCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/blesses/StatBlessesCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat/mortels', {
        url: "/stat/mortels",
        templateUrl: "../admin/components/stat/mortels/mortels.html",
        data: {pageTitle: 'Statistique des accidents mortels'},
        controller: "StatMortelsCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/mortels/StatMortelsCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat/physique', {
        url: "/stat/physique",
        templateUrl: "../admin/components/stat/physique/physique.html",
        data: {pageTitle: 'Statistique des accidents avec dégat physique'},
        controller: "StatPhysiqueCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/physique/StatPhysiqueCtrl.js'
                    ]
                });
            }]
        }
    })
    .state('stat/sans', {
        url: "/stat/sans",
        templateUrl: "../admin/components/stat/sans/sans.html",
        data: {pageTitle: 'Statistique des accidents sans dégat physique et corporels'},
        controller: "StatSansCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: [
                        '../admin/components/accident/accidentService.js',
                        '../admin/components/stat/sans/StatSansCtrl.js'
                    ]
                });
            }]
        }
    })




}]);

