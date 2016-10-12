// public/js/core.js
(function(angular){
    'use strict';

    var kittyTalk = angular.module('kittyTalk', ['ngFileUpload']);

    kittyTalk.controller('ktController',['$scope', 'Upload', '$timeout', '$http' ,function ($scope, Upload, $timeout, $http) {
        //signed in kitty
        $scope.auth_kitty = {
            id: null,
            image : 'img/paw.jpg'
        };
        //kitty to be viewed
        $scope.kitty = {
            id : null,
            image : 'img/paw.jpg'
        };
        //list of crew kitties
        $scope.crew = [];
        //list of all kitties
        $scope.kitties = [];
        //list of all mews of the kitty
        $scope.meows = [];
        //add Meow Form Data
        $scope.addMeowFormData = {
            auth_kitty_id: $scope.auth_kitty.id
        };

        /**
         * method to fetch a kitty page
         */
        $scope.viewKitty = function (id) {
            $http.get('/kitty/' + id)
                .success(function(response) {
                    $scope.kitty = response.kitty;
                    $scope.crew = response.crew;
                    $scope.viewAllKitties();
                    $scope.viewMeows(response.kitty._id);
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

        /**
         * method to sign in by uploading a kitty image
         * @param file
         */
        $scope.signIn = function(file) {
            file.upload = Upload.upload({
                url: '/signin',
                data: {username: $scope.username, file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    // @todo: upload worked, use the response to generate Kitty page
                    if(response.data.kitty){
                        $scope.kitty = response.data.kitty;
                        $scope.auth_kitty = $scope.kitty;
                        $scope.viewAllKitties();
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });
        };

        /**
         * method to fetch a list of all kitties
         */
        $scope.viewAllKitties = function () {
            $http.get('/kitties')
                .success(function(response) {
                    $scope.kitties = response.kitties;
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

        /**
         * method to add a kitty to the crew
         */
        $scope.addKittyToCrew = function (id) {
            $http.get('/crew/add/' + id , { withCredentials: true})
                .success(function(response) {
                    $scope.kitty = response.kitty;
                    $scope.crew = response.crew;
                    $scope.viewMeows(response.kitty._id);
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

        /**
         * method to remove a kitty from the crew
         */
        $scope.removeKittyFromCrew = function (id) {
            $http.get('/crew/remove/' + id , { withCredentials: true})
                .success(function(response) {
                    $scope.kitty = response.kitty;
                    $scope.crew = response.crew;
                    $scope.viewMeows(response.kitty._id);
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

        /**
         * method to add a meow
         */
        $scope.addMeow = function () {
            $http.post('/meows', $scope.addMeowFormData)
                .success(function(response) {
                    $scope.addMeowFormData = {
                        auth_kitty_id: $scope.auth_kitty._id
                    };
                    $scope.viewMeows($scope.auth_kitty._id);
                })
                .error(function(response) {
                    console.log('Error: ' + response);
                });
        };

        /**
         * method to fetch a kitty meows, including crews meows
         */
        $scope.viewMeows = function (id) {
            $http.get('/meows/' + id)
                .success(function(response) {
                    //we need the image of a kitty and we have all the images in the crew list or in kitty object
                    var full_meows = response.meows.map(function(meow) {
                        meow.kitty_info = ($scope.kitty._id == meow.kitty)
                                            ? $scope.kitty
                                            : $scope.crew.find(function(kitty) {
                                                    return kitty._id === meow.kitty;
                                            });
                        return meow;
                    });
                    $scope.meows = response.meows;
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };


    }]);

})(window.angular);
