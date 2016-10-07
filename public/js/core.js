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

        $scope.findKittyPage = function () {
           //todo:
        };

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
        },

        $scope.viewKitty = function() {

        }
    }]);

})(window.angular);
