'use strict';

MetronicApp.controller('UserAddCtrl', function ($scope, $timeout, SweetAlert, UserService, toaster, $location) {

    $scope.disable = false;
    $scope.user = {};

    $scope.add = function (valid) {
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
        if (typeof ($scope.user.password) == 'undefined' || $scope.user.password.length<3) {
            toaster.error("erreur", "Veuillez saisir le mot de passe de l'utilisateur");
            return;
        }
        if (typeof ($scope.user.role) == 'undefined') {
            toaster.error("erreur", "Veuillez saisir le rôle de l'utilisateur");
            return;
        }
        if (typeof ($scope.user.gsm) == 'undefined') {
            $scope.user.gsm=null;
        }

        $scope.disable = true;
        UserService.AddAdmin().save($scope.user,
            function (e) {
                $scope.disable = false;
                if(e.code>0){
                    toaster.success("success", "Utilisateur sauvegardé");
                    SweetAlert.swal({
                        title: "Succès",
                        text: "Utilisateur sauvegardé",
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
                else if(e.code==-4){
                    SweetAlert.swal({
                        title: "Erreur",
                        text: "Utilisateur déja inscrit",
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
            });
    };

});
