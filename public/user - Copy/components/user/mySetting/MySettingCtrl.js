'use strict';

MetronicApp.controller('MySettingCtrl', function ($scope,
                                                    $stateParams,
                                                    $location,
                                                    $timeout,
                                                    UserService,
                                                    DTOptionsBuilder,
                                                    DTColumnBuilder,
                                                    toaster,
                                                    $modal,
                                                    SweetAlert, $rootScope) {

    $scope.activeTab = 1;
    $scope.u ={};

    UserService.MyProfile().get({}, function (res) {
        if(res.code<0){
            $location.path('/user/list');
            return;
        }
        $scope.user = res.data;
    });

    $scope.changeActivTab = function (i) {
        $scope.activeTab=i;
    };

    $scope.editImage = function (data) {
        $scope.spinnerUpload=true;
        if(typeof(data[0]!='undefined') && data.length>0) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', data[0].lfDataUrl, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if (this.status == 200) {
                    var uInt8Array = new Uint8Array(this.response);
                    var i = uInt8Array.length;
                    var binaryString = new Array(i);
                    while (i--) {
                        binaryString[i] = String.fromCharCode(uInt8Array[i]);
                    }
                    var dataImg = binaryString.join('');
                    var base64 = window.btoa(dataImg);
                    var sendImage = {
                        'data': base64,
                        'type':data[0].lfFile.type
                    };
                    UserService.EditImage().save( sendImage
                        , function (res) {
                        if (res.code > 0) {
                            $rootScope.$broadcast('$includeContentLoaded');
                            SweetAlert.swal("Succés", "Image sauvegarder", "success");
                            $scope.user.profileImageURL = res.data.profileImageURL;
                            $scope.spinnerUpload = false;
                        }
                        else {
                            toaster.error("erreur", "Veuillez sélectioner une image");
                            $scope.spinnerUpload = false;
                        }
                    }, function (res) {
                        toaster.error("erreur", "Veuillez sélectioner une image");
                        });
                }
            };
            xhr.send();
        }
        else{
            toaster.error("erreur", "Veuillez sélectioner une image");
        }
    };

    $scope.editInfo = function () {
        if (typeof ($scope.user.firstName) == 'undefined' || $scope.user.firstName.length<3) {
            toaster.error("erreur", "Veuillez saisir le prènom de l'utilisateur");
            return;
        }
        if (typeof ($scope.user.lastName) == 'undefined' || $scope.user.lastName.length<3) {
            toaster.error("erreur", "Veuillez saisir le nom de l'utilisateur");
            return;
        }
        if (typeof ($scope.user.email) == 'undefined' || $scope.user.email.length<3) {
            toaster.error("erreur", "Veuillez saisir l'adresse email de l'utilisateur");
            return;
        }
        UserService.EditInfo().save($scope.user,
            function (e) {
                $scope.disable = false;
                if(e.code>0){
                    toaster.success("success", "Information sauvegardé");
                    SweetAlert.swal({
                        title: "Succès",
                        text: "Information sauvegardé",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Fermer"
                    });
                }
                else if(e.code==-2){
                    SweetAlert.swal({
                        title: "Erreur",
                        text: "Vérifier votre adresse email",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Fermer"
                    });
                }
                else if(e.code==-3){
                    SweetAlert.swal({
                        title: "Erreur",
                        text: "Mot de passe non sécuriser",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Fermer"
                    });
                }
                else{
                    toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                }
            },
            function (e) {
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                $scope.disable = false;
            }
        );
    };
    
    $scope.editPass = function () {
        if (typeof ($scope.u.oldPass) == 'undefined' || $scope.u.oldPass.length<3) {
            toaster.error("erreur", "Veuillez saisir l'ancien mot de passe");
            return;
        }
        if (typeof ($scope.u.newPass) == 'undefined' || $scope.u.newPass.length<3) {
            toaster.error("erreur", "Veuillez saisir le nouveau mot de passe");
            return;
        }
        if (typeof ($scope.u.newPass2) == 'undefined' || $scope.u.newPass2.length<3) {
            toaster.error("erreur", "Veuillez retapez votre mot de passe");
            return;
        }
        UserService.EditPass().save($scope.u,
            function (e) {
                $scope.disable = false;
                if(e.code>0){
                    toaster.success("success", "Information sauvegardé");
                    SweetAlert.swal({
                        title: "Succès",
                        text: "Information sauvegardé",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Fermer"
                    });
                }
                else if(e.code==-2){
                    SweetAlert.swal({
                        title: "Erreur",
                        text: "Vérifier votre mot de passe actuelle",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Fermer"
                    });
                }
                else{
                    toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                }
            },
            function (e) {
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                $scope.disable = false;
            }
        );
    };

});


