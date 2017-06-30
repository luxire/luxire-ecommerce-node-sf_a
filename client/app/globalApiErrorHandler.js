function handleError(error, $scope) {
  var message = "";
  var errorObject;
  if (error.data.msg) {
    $scope.alerts.push({ type: 'danger', message: error.data.msg });
  } else {
    errorObject = error.data.errors || error.data;
    for (attribute in errorObject) {
      message = `${attribute} ${errorObject[attribute].join('. ' + attribute + ' ')}`;
      $scope.alerts.push({ type: 'danger', message: message });
    }
  }

}
