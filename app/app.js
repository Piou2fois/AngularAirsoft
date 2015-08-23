	//Module declaration
	var app = angular.module("gestion",[
																				'angular.filter'
																				,'lumx'
																				,'ngRoute'
																				,'webcam'
																				,'ngDraggable'
																				,'ui.tinymce'
																				,'ngSanitize'
																			]);
	//Configuration of ngRoute
	app.config(function($routeProvider){
		$routeProvider
		//Root URL
		.when('/',{templateUrl:'partials/home.html'})
		//Managing the players list
		.when('/players',{templateUrl:'partials/players.html'})
		//To show the player details including the replicas. Use of resolve is to avoid an error on the picture of the player during the loading (there is no ng-repeat so the browser try to get an".jpg" file)
		.when('/player/:id',{templateUrl:'partials/player_details.html',controller:"ReplicasCtrl",resolve:{
				players:function(PlayersFactory){
					return PlayersFactory.getPlayers();
				}
		}
	})
		// To edit the player
		.when('/player/:id/edit',{templateUrl:'partials/player_edit.html',controller:"PlayersCtrl"})
		//Managing the teams for the game
		.when('/groups',{templateUrl:'partials/groups.html'})
		//To edit a group
		.when('/group/:id/edit',{templateUrl:'partials/group_edit.html',controller:"GroupsCtrl"})
		//Managing the scripts
		.when('/scripts',{templateUrl:'partials/scripts.html'})
		//Editing the scripts
		.when('/script/:id/edit',{templateUrl:'partials/script_edit.html',controller:"ScriptsCtrl"})
		//Help page
		.when('/help',{templateUrl:'partials/help.html'})
		//Otherwise
		.otherwise({redirectTO : '/'});
	});
