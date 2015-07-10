var app = angular.module("gestion",['ngRoute','ui.utils','webcam']);
	app.config(function($routeProvider){
		$routeProvider
		.when('/',{templateUrl:'partials/home.html'})
		.when('/players',{templateUrl:'partials/players.html'})
		.when('/players_new',{templateUrl:'partials/players_new.html'})
		.when('/teams',{templateUrl:'partials/teams.html'})
		.when('/scenarios',{templateUrl:'partials/scenarios.html'})
		.when('/player/:player_id',{templateUrl:'partials/player_details.html'})
		.otherwise({redirectTO : '/'});
	})
