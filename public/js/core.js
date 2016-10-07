// public/js/core.js
(function(angular){
    'use strict';

    var kittyTalk = angular.module('kittyTalk', ['ngFileUpload']);

    kittyTalk.controller('ktController',['$scope', 'Upload', '$timeout' ,function ($scope, Upload, $timeout, $http) {
        $scope.kitty = {
            id : null,
            image : 'img/paw.jpg'
        };

        $scope.addMeowData = {};

        /**
         * method to fetch a kitty page
         */
        $scope.viewKitty = function (id) {
            console.log('find kitty');
            $http.get('/kitty/' + id)
                .success(function(response) {
                    $scope.kitty = $scope.kitty = response.data.kitty;
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
                        $scope.$apply();
                    }
                    console.log(response.data.kitty);
                });
            }, function (response) {
                console.log(response);
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });
        };

    }]);

})(window.angular);
