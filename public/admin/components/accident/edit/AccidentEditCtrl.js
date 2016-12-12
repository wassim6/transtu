'use strict';

MetronicApp.controller('AccidentEditCtrl', function ($rootScope, $scope, $http, $stateParams, $timeout, SweetAlert, AccidentService, uiGmapGoogleMapApi, $log, toaster, $location) {

    var id = $stateParams.id;
    $scope.success = false;
    $scope.error = false;
    $scope.disable = false;
    $scope.optionsAutocompleteMaps = {
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

    AccidentService.FindById().get({ID: id}, function (res) {
        if(res.code<0){
            $location.path('/accident/list');
            return;
        }
        $scope.accident = res.data;
        initMap();
        $scope.slider = {
            value: parseInt(res.data.accident_type),
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
        $scope.address.components = res.data.adress;
        $scope.address.name=res.data.adress.name;
    });


    $scope.$watch('address.name', function (newVal, oldVal) {
        //console.log(newVal);
        if (typeof(newVal) != 'undefined' && $scope.form.address.$valid) {
            $timeout(function () {
                if (typeof($scope.address.components.location) != 'undefined' && typeof($scope.address.components.location.lat) != 'undefined') {
                    $scope.accident.location.coordinates[0] = $scope.address.components.location.lat;
                    $scope.accident.location.coordinates[1] = $scope.address.components.location.long;
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
                            latitude: $scope.accident.location.coordinates[0],
                            longitude: $scope.accident.location.coordinates[1]
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

    $scope.edit = function (valid) {
        if (typeof ($scope.accident.date) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner la date et l'heure de l'accident");
            return;
        }
        if (typeof ($scope.address.name) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner l'adresse de l'accident");
            return;
        }
        if (typeof ($scope.accident.busType) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner le type du Bus");
            return;
        }
        if (typeof ($scope.accident.roadType) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner le type de Route");
            return;
        }
        if (typeof ($scope.accident.ligne) == 'undefined') {
            toaster.error("erreur", "Veuillez indiquer le numéro de ligne");
            return;
        }
        if (typeof ($scope.accident.degats_corporels) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner les dégats corporel");
            return;
        }
        if (typeof ($scope.accident.degats_physiques) == 'undefined') {
            toaster.error("erreur", "Veuillez selectionner les dégats physique");
            return;
        }
        if ((typeof($scope.accident.injuriesNumber) == 'undefined' || typeof($scope.accident.deathsNumber) == 'undefined') && $scope.accident.degats_corporels == true) {
            toaster.error("erreur", "Veuillez indiquez le nombre des blésses et de morts");
            return;
        }
        else if ($scope.accident.degats_corporels == false) {
            $scope.accident.injuriesNumber = 0;
            $scope.accident.deathsNumber = 0;
        }
        if($scope.accident.date instanceof Date){
            var dateHeure = $scope.accident.date.getFullYear() + '-' + (zeroPad($scope.accident.date.getMonth() + 1)) + '-' + (zeroPad($scope.accident.date.getDate()));
            dateHeure += "T" + (zeroPad($scope.accident.date.getHours())) + ":" + (zeroPad($scope.accident.date.getMinutes())) + ":00";
        }
        else
            var dateHeure = $scope.accident.date;

        var address = $scope.address.components;
        address.name = $scope.address.name;
        var obj = {
            accidentId:$scope.accident._id,
            roadType: $scope.accident.roadType,
            busType: $scope.accident.busType,
            date: dateHeure,
            ligne: $scope.accident.ligne,
            degats_physiques: $scope.accident.degats_physiques,
            degats_corporels: $scope.accident.degats_corporels,
            injuriesNumber: $scope.accident.injuriesNumber,
            deathsNumber: $scope.accident.deathsNumber,
            accident_type: $scope.slider.value,
            adress: address,
            location: $scope.accident.location.coordinates[0]+","+$scope.accident.location.coordinates[1],
            district:$scope.accident.district,
            numeroBus:$scope.accident.numeroBus,
            numeroPv:$scope.accident.numeroPv,
            posteGardePolice:$scope.accident.posteGardePolice,
            observation:$scope.accident.observation
        };
        $scope.disable = true;
        AccidentService.EditAccident().save(obj,
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
        $scope.map = {center: {latitude: $scope.accident.location.coordinates[0], longitude: $scope.accident.location.coordinates[1]}, zoom: 10};
        $scope.optionsMap = {scrollwheel: true};
        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.accident.location.coordinates[0],
                longitude: $scope.accident.location.coordinates[1]
            },
            options: {draggable: true},
            events: {
                dragend: function (marker, eventName, args) {
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
});
