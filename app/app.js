	//Module declaration
	var app = angular.module("gestion",[
																				'angular.filter'
																				,'lumx'
																				,'ngRoute'
																				,'webcam'
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
				player:function(PlayersFactory,$route){
					PlayersFactory.getPlayers().then(player = PlayersFactory.getPlayer($route.current.params.id));
					return player;
				}
		}
	})
		// To edit the player
		.when('/player/:id/edit',{templateUrl:'partials/player_edit.html',controller:"PlayersCtrl"})
		// To edit the replica
		.when('/replica/:id/edit',{templateUrl:'partials/replica_edit.html',controller:"ReplicasCtrl",resolve:{player:function(){return {};}}})
		//Managing the teams for the game
		.when('/groups',{templateUrl:'partials/groups.html'})
		//To edit a group
		.when('/group/:id/edit',{templateUrl:'partials/group_edit.html',controller:"GroupsCtrl"})
		//Managing the scripts
		.when('/scripts',{templateUrl:'partials/scripts.html'})
		//Add a script
		.when('/script/insert',{templateUrl:'partials/script_insert.html',controller:"ScriptsCtrl"})
		//Editing the scripts
		.when('/script/:id/edit',{templateUrl:'partials/script_edit.html',controller:"ScriptsCtrl"})
		//Help page
		.when('/help',{templateUrl:'partials/help.html'})
		//Otherwise
		.otherwise({redirectTO : '/'});
	});
