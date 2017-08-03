angular.module('luxire')
    .service('helpPageService', function ($http) {

        this.getAttributeHelpDetails = function () {
            return $http.get("assets/attributeHelpDetails.json");
        }

        this.updateAttributeHelpDetails = function (data) {
            return $http.post("api/v1/admin/helpPage/update", JSON.stringify(data));
        }

    })

