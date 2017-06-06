// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire', ['ui.router','ngRoute',
						'ui.bootstrap','angularFileUpload',
						'ui.bootstrap.datetimepicker','ngTagsInput',
						'ngMessages', 'AngularPrint', 'monospaced.qrcode',
						'ui.tree','infinite-scroll', 'ngAside',
						'angucomplete-alt', 'angularAwesomeSlider',
						'angular-cache', 'ui.slider', 'mega-menu',
						'rzModule', 'slickCarousel', 'angulartics','angulartics.google.analytics'])//removed ng-animate to resolve carousel issue


.run(function($location,$rootScope, $state){
	// $location.path('/collections');
	$rootScope.alerts = [];

  $rootScope.close_alert = function(index){
    $rootScope.alerts.splice(index, 1);
  };
	$rootScope.page = {
		  title: "",
      setTitle: function(title) {
          this.title = title || "Bespoke Shirts by Luxire. Custom made to Perfection";
      }
  }
  // $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
  //     $rootScope.page.setTitle(current.$$route.title || 'Home');
  // });
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
			if(toState.name.indexOf('admin') !== -1){
				if(window.localStorage.luxire_token || window.sessionStorage.luxire_token){
					var token = window.localStorage.luxire_token || window.sessionStorage.luxire_token;
					var roles = JSON.parse(atob(token.split('.')[1])).spree_roles;
					var is_admin = false;
					for(var i=0;i<roles.length;i++){
						if(roles[i].name.toLowerCase() == "admin"){
							is_admin = true;
						}
					}
					if(!is_admin){
						event.preventDefault();
						$rootScope.alerts.push({type: 'warning', message: 'Unauthorised'});
					}
				}
				else{
					event.preventDefault();
					$state.go('login');
				}
			}

			if(toState.name == 'test'){
				window.sessionStorage.luxire_token = toStateParams.id;
				event.preventDefault();

				$state.go('admin.default');
			}
			if(toState.data.require_auth){
				if(window.localStorage.luxire_token == undefined && window.sessionStorage.luxire_token == undefined ){
					event.preventDefault();
					$state.go('login');
				}
			}
			if(toState.name == 'login'){
				if(window.localStorage.luxire_token != undefined || window.sessionStorage.luxire_token != undefined ){
					event.preventDefault();
					$rootScope.alerts.push({type: 'warning', message: 'You are already logged in!'});

				}
			}
			if(toState.name.indexOf('checkout') != -1){
				$rootScope.page.setTitle("Luxire Custom Clothing - Checkout");
			}
			else{
				$rootScope.page.setTitle();//Reinitializing title on state change
			}
      // // track the state the user wants to go to; authorization service needs this
      // $rootScope.toState = toState;
      // $rootScope.toStateParams = toStateParams;
      // // if the principal is resolved, do an authorization check immediately. otherwise,
      // // it'll be done when the state it resolved.
      // if (principal.isIdentityResolved()) authorization.authorize();
	});

})
.run(function($http){
  $http.defaults.headers.common['x-luxire-token'] = window.localStorage.luxire_token || window.sessionStorage.luxire_token;
})
.directive("whenScrolled", function(){
	return {
		restrict:'A',
		link: function(scope,elem,attrs){
			raw = elem[0];
			elem.bind("scroll", function(){
					if(raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight){
						scope.$apply(attrs.whenScrolled);
					}
			});
		}
	}
})
.config(['$routeProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	$locationProvider.html5Mode(true);
	$httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	/*Set Default route*/
	$urlRouterProvider.otherwise('/');

	$urlRouterProvider.otherwise('/');
	$stateProvider
	/*Invoices*/
	.state('invoices',{
		url: '/invoice/:number?token',
		params: {param	: {}},
		templateUrl: 'app/customer/invoices/partials/invoicePage.html',
		controller: 'invoiceController',
		data: {
			require_auth: false
		},
	})
	.state('order_sheet_print',{
		url: '/order_sheet/:order_number?line_item_id',
		templateUrl: 'app/admin/order/partials/order_sheet.html',
		controller: 'OrderSheetController',
		data: {
			require_auth: true
		},
	})

}])
