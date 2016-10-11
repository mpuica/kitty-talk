// public/js/core.js
(function(angular){
    'use strict';

    var kittyTalk = angular.module('kittyTalk', ['ngFileUpload']);

    kittyTalk.controller('ktController',['$scope', 'Upload', '$timeout', '$http' ,function ($scope, Upload, $timeout, $http) {
        //signed in kitty
        $scope.auth_kitty = null;
        //kitty to be view
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
        $scope.addMeowData = {};

        /**
         * method to fetch a kitty page
         */
        $scope.viewKitty = function (id) {
            console.log('find kitty');
            $http.get('/kitty/' + id)
                .success(function(response) {
                    $scope.kitty = response.data.kitty;
                    $scope.crew = response.crew;
                    $scope.viewAllKitties();
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
                        $scope.auth_kitty = $scope.kitty._id;
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
            console.log('find all kitties');
            $http.get('/kitties')
                .success(function(response) {
                    console.log(response);
                    $scope.kitties = response.kitties;
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

        /**
         * method to fetch a list of all kitties
         */
        $scope.viewAllKitties = function () {
            console.log('find all kitties');
            $http.get('/kitties')
                .success(function(response) {
                    console.log(response);
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
            console.log('add kitty to crew');
            $http.get('/crew/add/' + id , { withCredentials: true})
                .success(function(response) {
                    console.log(response);
                    $scope.kitty = response.kitty;
                    $scope.crew = response.crew;
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
            console.log('remove kitty from crew');
            $http.get('/crew/remove/' + id , { withCredentials: true})
                .success(function(response) {
                    console.log(response);
                    $scope.kitty = response.kitty;
                    $scope.crew = response.crew;
                })
                .error(function(response) {
                    console.log('Error: ' + response.status);
                    $scope.errorMsg = response.status + ': ' + response.data;
                });
        };

    }]);

})(window.angular);
