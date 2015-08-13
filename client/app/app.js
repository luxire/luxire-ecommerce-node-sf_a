// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire', ['ui.router','ngRoute','ui.bootstrap'])

.run(function($location){
	$location.path('/productdetails');
})
.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/test',{
		templateUrl: 'app/test/test.html',
		controller: 'testController'
	}).
	when('/productdetails',{
		templateUrl: 'app/productDetails/productDetails.html',
		controller: 'productDetailsController'
	}).
	when('/customize',{
		templateUrl: 'app/customizeGarments/customizeGarments.html',
		controller: 'customizeGarmentsController'
	}).
	when('/personalize',{
		templateUrl: 'app/personaliseGarments/personaliseGarments.html',
		controller: 'personaliseGarmentsController'
	}).
	when('/measurement',{
		templateUrl: 'app/measurementGarments/measurementGarments.html',
		controller: 'measurementGarmentsController'
	}).
	when('/admin',{
		templateUrl: 'app/admin/admin.html',
		controller: 'adminController'
	})
}])
