(function(app) {
    'use strict';

    app.controller('fileUploadCtrl', fileUploadCtrl);

    fileUploadCtrl.$inject = ['$scope', 'Upload', '$timeout'];

    function fileUploadCtrl($scope, Upload, $timeout) {

        $scope.uploadFiles = function(file, errFiles, id) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: baseUrl + "Users/UploadFile",
                    data: { file: file , 'id': id}
                });

                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }
    }
})(angular.module("accessControl"));
