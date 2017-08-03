angular.module('luxire')
    .controller('HelpPageController', ['$scope', '$http', 'helpPageService', function ($scope, $http, helpPageService) {

        $scope.loading = true;

        helpPageService.getAttributeHelpDetails().then(function (data) {
            $scope.obj.data = data.data;
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            $scope.alerts.push({ type: 'danger', message: 'Something went wrong. Unable to fetch help attribute details' });
            console.error("Error fecthing attribute help detail".error);
        })

        $scope.obj = { data: {}, options: { mode: 'tree' } };
        $scope.onLoad = function (instance) {
            instance.expandAll();
        }
        $scope.btnClick = function () {
            $scope.obj.options.mode = 'code'; //should switch you to code view
        }

        $scope.updateJson = function () {
            $scope.loading = true;
            helpPageService.updateAttributeHelpDetails($scope.obj.data).then(function (data) {
                $scope.alerts.push({ type: 'success', message: 'help attribute updated successfully' });
                $scope.loading = false;
            }, function (error) {
                $scope.loading = false;
                $scope.alerts.push({ type: 'danger', message: 'Something went wrong. Changes are not saved.' });
                console.error(error);
            })
        }
    }])

