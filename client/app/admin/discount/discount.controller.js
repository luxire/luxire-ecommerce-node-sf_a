angular.module('luxire')
.controller('DiscountController',function($scope){

  $scope.today = function() {
    $scope.discountStart = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountStart = null;
  };

  $scope.discountCodeGen = function() {
    var length = 12;
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var result = '';
   for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
   $scope.discountCode = result;
}

$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();
$scope.maxDate = new Date(2020, 5, 22);

$scope.open = function($event) {
  $scope.status.opened = true;
};

$scope.dateOptions = {
  formatYear: 'yy',
  startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];

$scope.status = {
  opened: false
};

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var afterTomorrow = new Date();
afterTomorrow.setDate(tomorrow.getDate() + 2);
$scope.events =
  [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

$scope.getDayClass = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);

    for (var i=0;i<$scope.events.length;i++){
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

      if (dayToCheck === currentDay) {
        return $scope.events[i].status;
      }
    }
  }

  return '';
};



});
