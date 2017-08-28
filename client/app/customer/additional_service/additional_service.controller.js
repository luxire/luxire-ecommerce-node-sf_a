angular.module('luxire')
    .controller('AdditionalServiceController', ['$scope', '$rootScope', 'AdditionalService', 'ImageHandler', 'CustomerUtils', 'CustomerOrders', '$state', function ($scope, $rootScope, AdditionalService, ImageHandler, CustomerUtils, CustomerOrders, $state) {

        $scope.loading_product = true;
        $scope.active_product_description_image = {
            product_url: '',
            large_url: '',
            original_url: ''
        };

        $scope.notes = '';

        $scope.get_subheader_top_margin = function () {
            return $(".customer-main-nav-header").innerHeight() + 'px';
        };

        $scope.getImage = function (url) {
            return ImageHandler.url(url);
        }

        $scope.selected_currency = $rootScope.luxire_cart.currency ? $rootScope.luxire_cart.currency : CustomerUtils.get_local_currency_in_app();


        $scope.$on('measurement_unit_change', function (event, data) {
            $scope.selected_measurement_unit = data.symbol.toLowerCase();
        });


        $scope.$on('currency_change', function (event, data) {
            if ($scope.selected_currency === '') {
                $scope.selected_currency = data;
                loadProduct();
            } else {
                $scope.selected_currency = data;
            }
        });

        var loadProduct = function () {
            AdditionalService.getAdditionalServiceProduct().then(function (data) {
                $scope.loading_product = false;
                $scope.product = data.data;
                $scope.active_product_description_image = $scope.product.master.images[0];
                $scope.product.variants.push($scope.product.master);
            }, function (error) {
                $scope.loading_product = false;
                console.error(error);
            })
        }

        if ($scope.selected_currency !== '') {
            loadProduct();
        }

        $scope.add_to_cart = function () {
            if(!$scope.selectedVariant){
                $rootScope.alerts.push({ type: 'danger', message: 'Please select an amount' });
                return;
            }
            variant = $scope.selectedVariant;
            $scope.selected_measurement_unit = angular.element("#measurementUnit")[0].innerText.toLowerCase();
            $scope.loading_cart = true;
            if ($rootScope.luxire_cart && $rootScope.luxire_cart.line_items) {
                CustomerOrders.add_line_item($rootScope.luxire_cart, {}, variant, false, $scope.selected_currency, $scope.selected_measurement_unit, $scope.notes)
                    .then(function (data) {
                        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function (data) {
                            $rootScope.luxire_cart = data.data;
                            $scope.loading_cart = false;
                            $rootScope.alerts.push({ type: 'success', message: 'Item added to cart' });
                            $state.go('customer.pre_cart');
                        }, function (error) {
                            $scope.loading_cart = false;
                            console.error(error);
                        });
                    }, function (error) {
                        $scope.loading_cart = false;
                        if (error.data && error.data.msg && error.data.msg.includes("out of stock")) {
                            $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
                        } else {
                            $rootScope.alerts.push({ type: 'danger', message: 'Failed to add to cart' });
                        }
                        console.error(error);
                    });
            }
            else {
                CustomerOrders.create_order({}, variant, false, $scope.selected_currency, $scope.selected_measurement_unit, $scope.notes)
                    .then(function (data) {
                        $rootScope.luxire_cart = data.data;
                        $scope.loading_cart = false;
                        $rootScope.alerts.push({ type: 'success', message: 'Item added to cart' });
                        $state.go('customer.pre_cart');
                    }, function (error) {
                        $scope.loading_cart = false;
                        if (error.data && error.data.msg && error.data.msg.includes("out of stock")) {
                            $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
                        } else {
                            $rootScope.alerts.push({ type: 'danger', message: 'Failed to add to cart' });
                        }
                        console.error(error);
                    });
            }
        }
    }]);