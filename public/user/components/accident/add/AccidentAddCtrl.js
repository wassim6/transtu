'use strict';

MetronicApp.controller('AccidentAddCtrl', function ($rootScope, $scope, $http, $timeout, SweetAlert, AccidentService, uiGmapGoogleMapApi, $log, toaster, $location) {
    $scope.success = false;
    $scope.error = false;
    $scope.disable = false;
    $scope.optionsAutocompleteMaps = {
        //types: ['(cities)'],
        componentRestrictions: {country: 'TN'}
    };
    $scope.address = {
        name: '',
        place: '',
        components: {
            placeId: '',
            streetNumber: '',
            street: '',
            city: '',
            state: '',
            countryCode: '',
            country: '',
            postCode: '',
            district: '',
            location: {
                lat: '',
                long: ''
            }
        }
    };
    $scope.form = {$valid: false};

    initMap();

    $scope.slider = {
        value: 2,
        options: {
            showTicksValues: true,
            stepsArray: [
                {value: 1, legend: 'Collision'},
                {value: 2, legend: 'Agression'},
                {value: 3, legend: 'Acc. Circulation'},
                {value: 4, legend: 'Autre'}
            ],
            showSelectionBar: true,
            getSelectionBarColor: function(value) {
                if (value <= 2)
                    return 'green';
                if (value == 3)
                    return 'orange';
                if (value <= 4)
                    return 'red';
                return '#2AE02A';
            }
        }
    };

    $scope.$watch('address.name', function (newVal, oldVal) {
        if (typeof(newVal) != 'undefined' && $scope.form.address.$valid) {
            $timeout(function () {
                if (typeof($scope.address.components.location.lat) != 'undefined') {
                    $scope.a.latitude = $scope.address.components.location.lat;
                    $scope.a.longitude = $scope.address.components.location.long;
                    $scope.map = {
                        center: {
                            latitude: $scope.address.components.location.lat,
                            longitude: $scope.address.components.location.long
                        }, zoom: 10
                    };
                    $scope.optionsMap = {scrollwheel: true};
                    $scope.marker = {
                        id: 0,
                        coords: {
                            latitude: $scope.a.latitude,
                            longitude: $scope.a.longitude
                        },
                        options: {draggable: true},
                        events: {
                            dragend: function (marker, eventName, args) {
                                //$log.log('marker dragend');
                                var lat = marker.getPosition().lat();
                                var lon = marker.getPosition().lng();
                                $scope.a.latitude = lat;
                                $scope.a.longitude = lon;

                                $scope.marker.options = {
                                    draggable: true,
                                    labelContent: "lat: ",
                                    labelAnchor: "100 0",
                                    labelClass: "marker-labels"
                                };
                            }
                        }
                    };
                }

            }, 500);
        }
    });

    $scope.add = function (valid) {
        if (typeof ($scope.dt) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner la date de l'accident");
            return;
        }
        if (typeof ($scope.mytime) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner l'heure de l'accident");
            return;
        }
        if (typeof ($scope.address.name) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner l'adresse de l'accident");
            return;
        }
        if (typeof ($scope.typeBus) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner le type du Bus");
            return;
        }
        if (typeof ($scope.typeRoute) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner le type de Route");
            return;
        }
        if (typeof ($scope.numLigne) == 'undefined') {
            toaster.error("erreur", "Veuillez indiquer le numéro de ligne");
            return;
        }
        if (typeof ($scope.corporel) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner les dégats corporel");
            return;
        }
        if (typeof ($scope.physique) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner les dégats physique");
            return;
        }
        if ((typeof($scope.blesse) == 'undefined' || typeof($scope.mort) == 'undefined') && $scope.corporel == true) {
            toaster.error("erreur", "Veuillez indiquez le nombre des blésses et de morts");
            return;
        }
        else if ($scope.corporel == false) {
            $scope.blesse = 0;
            $scope.mort = 0;
        }
        var dateHeure = $scope.dt.getFullYear() + '-' + (zeroPad($scope.dt.getMonth() + 1)) + '-' + (zeroPad($scope.dt.getDate()));
        dateHeure += "T" + (zeroPad($scope.mytime.getHours())) + ":" + (zeroPad($scope.mytime.getMinutes())) + ":00";

        var address = $scope.address.components;
        address.name = $scope.address.name;
        //console.log($scope.a);
        var obj = {
            roadType: $scope.typeRoute,
            busType: $scope.typeBus,
            date: dateHeure,
            ligne: $scope.numLigne,
            degats_physiques: $scope.physique,
            degats_corporels: $scope.corporel,
            injuriesNumber: $scope.blesse,
            deathsNumber: $scope.mort,
            accident_type: $scope.slider.value,
            adress: address,
            location: $scope.a.latitude+","+$scope.a.longitude,
            district:$scope.district,
            numeroBus:$scope.numeroBus,
            numeroPv:$scope.numeroPv,
            posteGardePolice:$scope.posteGardePolice,
            observation:$scope.observation
        };
        $scope.disable = true;
        AccidentService.AddAccident().save(obj,
            function (e) {
                $scope.disable = false;
                toaster.success("success", "Accident sauvegardé");
                SweetAlert.swal({
                    title: "Succès",
                    text: "Accident sauvegardé",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Fermer"
                });
            },
            function (e) {
                toaster.error("erreur", "Une erreur est survenue. Veuillez réessayer plus tard");
                $scope.disable = false;
            });
    };


    function initMap() {
        $scope.a = {};
        $scope.a.latitude = 35.61028800437389;
        $scope.a.longitude = 9.560546875;
        $scope.map = {center: {latitude: $scope.a.latitude, longitude: $scope.a.longitude}, zoom: 5};
        $scope.optionsMap = {scrollwheel: true};
        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.a.latitude,
                longitude: $scope.a.longitude
            },
            options: {draggable: true},
            events: {
                dragend: function (marker, eventName, args) {
                    //$log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $scope.a.latitude = lat;
                    $scope.a.longitude = lon;

                    $scope.marker.options = {
                        draggable: true,
                        labelContent: "",//"lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                        labelAnchor: "100 0",
                        labelClass: "marker-labels"
                    };
                }
            }
        };
    };

    function zeroPad(n) {
        return n < 10 ? '0' + n : n;
    };
    /*
     Fonction Non utilisé
     $scope.refresh = function () {
     if(typeof($scope.a=='undefined') || typeof($scope.a.latitude=='undefined'))
     return;

     console.log($scope.a.latitude + " - " + $scope.a.longitude);
     $scope.map = {center: {latitude: $scope.a.latitude, longitude: $scope.a.longitude}, zoom: 8};
     $scope.optionsMap = {scrollwheel: true};
     $scope.marker = {
     id: 0,
     coords: {
     latitude: $scope.a.latitude,
     longitude: $scope.a.longitude
     },
     options: {draggable: true},
     events: {
     dragend: function (marker, eventName, args) {
     //$log.log('marker dragend');
     var lat = marker.getPosition().lat();
     var lon = marker.getPosition().lng();
     $scope.a.latitude = lat;
     $scope.a.longitude = lon;

     $scope.marker.options = {
     draggable: true,
     labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
     labelAnchor: "100 0",
     labelClass: "marker-labels"
     };
     }
     }
     };

     };
     */
});
