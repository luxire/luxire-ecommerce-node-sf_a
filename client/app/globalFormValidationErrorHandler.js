
function handleValidationError($scope, formName) {
    elementName = $scope[formName].$error.required[0].$name;
    elementName = capitalizeFirstLetter(elementName);
    $scope.alerts.push({ type: 'danger', message: elementName + ' cannot be empty. Please Insert a value' });
    if (elementName.includes(" ")) {
        elementName = elementName.split(" ").join("_");
    }
    angular.element('#' + elementName).focus();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}