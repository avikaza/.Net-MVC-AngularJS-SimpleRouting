
/*angular
    .module('myApp.ctrl.about', [])
    .controller('aboutCtrl', ['$scope', '$window', function ($scope, $window) {
   */
function AboutCtrl($scope, $window) {
    var w = angular.element($window);

    $scope.version = "1.0.0";
    $scope.windowWidth = 0;
    $scope.windowHeight = 0;
    $scope.includeTest = "/SPAView/index.html";

    var setDimensions = function () {
        $scope.windowWidth = w.width;
        $scope.windowHeight = w.height;
    };

    w.bind('resize', function () {
        $scope.$apply(function () {
            setDimensions();
        });
    });
    setDimensions();

}
AboutCtrl.$inject = ['$scope', '$window'];

/*]);*/
