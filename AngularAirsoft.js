	//Module declaration
	var app = angular.module("gestion",['angular.filter','lumx','ngRoute','webcam','ngDraggable']);
	//Configuration of ngRoute
	app.config(function($routeProvider){
		$routeProvider
		//Root URL
		.when('/',{templateUrl:'partials/home.html'})
		//Managing the players list
		.when('/players',{templateUrl:'partials/players.html'})
		//To show the player details including the replicas. Use of resolve is to avoid an error on the picture of the player during the loading (there is no ng-repeat so the browser try to get an".jpg" file)
		.when('/player/:player_id',{templateUrl:'partials/player_details.html',controller:"ReplicasCtrl",resolve:{
				players:function(PlayersFactory){
					return PlayersFactory.getPlayers();
				}
		}
	})
		//Managing the teams for the game
		.when('/groups',{templateUrl:'partials/groups.html'})
		//Managing the scenarios
		.when('/scenarios',{templateUrl:'partials/scenarios.html'})
		//Managing the scenarios
		.otherwise({redirectTO : '/'});
	});

// CONTROLLER
// GroupsCtrl : used to manage the groups
app.controller('GroupsCtrl',function(
																			$scope
																			,$http
																			,$q
																			,$routeParams
																			,PlayersFactory
																			,GroupsFactory
																			,$rootScope
																		)
																		{
	$scope.params = $routeParams;
	$scope.players = GroupsFactory.getGroupsPlayers().then(function(players){
										$scope.players=players;
									},function(msg){alert(msg);});

	$scope.groups = GroupsFactory.getGroups().then(function(groups){
										$scope.groups=groups;
										//'No Group' group creation for players with no group attributed
										empty={'GROUPS_DESCRIPTION':'Liste des joueurs sans groupe','GROUPS_ID':null,'GROUPS_NAME':'Sans groupe'};
										groups.push(empty);
									},function(msg){alert(msg);});
			$scope.$watch('players',function(){
				$scope.nbgroups = $scope.groups.length;
			},true
			);
	$scope.onDropComplete=function(data,GROUPS_ID){
											data.GROUPS_ID=GROUPS_ID;
										};

	$scope.groups_delete = function(group){
													if (confirm('Voulez-vous supprimer ce groupe ?')){
														idx=$scope.groups.indexOf(group);
														GroupsFactory.remGroup(group.GROUPS_ID).then(function(){
															$scope.groups.splice(idx,1);
														},function(msg){alert(msg);});
													}
												};
  $scope.groups_insert = function(NG){
												  GroupsFactory.addGroup(NG).then(function(group){
															$scope.groups=$scope.groups.concat(group);
															NG={};
														},function(msg){alert(msg);}
													);
												};
											});

// CONTROLLER
// PlayersCtrl : used to manage the players
app.controller('PlayersCtrl',function(
																			$scope
																			,$http
																			,$q
																			,$routeParams
																			,PlayersFactory
																			,ReplicasFactory
																			,WebcamFactory
																			,LxNotificationService
																			,LxDialogService
																		)
																		{
	$scope.params = $routeParams;
	$scope.player_edited={};
	$scope.players = PlayersFactory.getPlayers().then(function(players){
		$scope.players=players
	},function(msg){alert(msg);});
	$scope.replicas = ReplicasFactory.getReplicas().then(function(replicas){
		$scope.replicas = replicas;
	},function(msg){alert(msg);});
	$scope.$watch('players',function(){
		$scope.nbplayers = $scope.players.length;
		},true
	);
	$scope.players_edit=function(player,dialogId){
		$scope.player_edited=angular.copy(player);
		LxDialogService.open(dialogId);
		console.log($scope.player_edited);

	};
	$scope.players_delete = function(player){
		if (confirm('Voulez-vous supprimer ce joueur ?')){
			idx=$scope.players.indexOf(player);
			PlayersFactory.remPlayer(player.PLAYERS_ID,player.PLAYERS_PICTURE).then(function(){
				$scope.players.splice(idx,1);
			},function(msg){alert(msg);});
		}
	};
  $scope.players_insert = function(NP){
	  PlayersFactory.addPlayer(NP).then(function(player){$scope.players=$scope.players.concat(player);NP={};},function(msg){alert(msg);});
	};
	$scope.player_picture_update = function(player){
		if (confirm('Voulez-vous changer la photo ?')){
		idx=$scope.players.indexOf(player);
		PlayersFactory.updatePicture(player.PLAYERS_ID,player.PLAYERS_PICTURE,$scope.makesnapshot())
		.then(function(picture_id){$scope.players[idx].PLAYERS_PICTURE=picture_id;},function(msg){alert(msg);});
	}
};
	$scope.makesnapshot = function() {
		return WebcamFactory.makesnapshot();
	}
});

// CONTROLLER
// ReplicasCtrl : used to manage the replicas
app.controller('ReplicasCtrl',function(
																				$scope
																				,$http
																				,filterFilter
																				,$q
																				,$routeParams
																				,PlayersFactory
																				,ReplicasFactory
																				,WebcamFactory
																				,players
																				,LxNotificationService
																				,LxDialogService
																			)
																				{
	$scope.params = $routeParams;
	$scope.players = players;
	$scope.player = PlayersFactory.getPlayer($scope.params.player_id);
	$scope.replica_edited={};
	$scope.replicas = ReplicasFactory.getReplicas().then(function(replicas){
		$scope.replicas=replicas;
	},function(msg){alert(msg);});
	$scope.replicas_insert = function(NR){
														ReplicasFactory.addReplica(NR)
														.then(function(replica){
															$scope.replicas=$scope.replicas.concat(replica);
														}
														,function(msg){alert(msg);});
												  };
	$scope.replicas_edit=function(replica,dialogId){
													$scope.replica_edited=angular.copy(replica);
													LxDialogService.open(dialogId);
													console.log($scope.replica_edited);

												};
	$scope.replicas_delete = function(replica){
														if (confirm('Voulez-vous supprimer cette réplique ?')){
															idx=$scope.replicas.indexOf(replica);
															ReplicasFactory.remReplica(replica.REPLICAS_ID,replica.REPLICAS_PICTURE)
															.then(function(){$scope.replicas.splice(idx,1)},function(msg){alert(msg);})};
														};
	$scope.replica_picture_update = function(replica){
																		if (confirm('Voulez-vous supprimer cette réplique ?')){
																			idx=$scope.replicas.indexOf(replica);
																			ReplicasFactory.updatePicture(replica.REPLICAS_ID,replica.REPLICAS_PICTURE,$scope.makesnapshot())
																			.then(function(picture_id){$scope.replicas[idx].REPLICAS_PICTURE=picture_id;},function(msg){alert(msg);});
																		};
																	};
		$scope.makesnapshot = function(){
														return WebcamFactory.makesnapshot();
													};
  });

// CONTROLLER
// WebcamCtrl : used to manage the webcam.
app.controller('WebcamCtrl',function(
																			$scope
																			,WebcamFactory
																		)
																		{
$scope.C_identite = {
	video: null // Will reference the video element on success
};
WebcamFactory.thecanvas=document.querySelector('#snapshot');
console.log(WebcamFactory.thecanvas);
$scope.video_success = function(){
	WebcamFactory.videolive = $scope.C_identite.video;
  console.log(WebcamFactory);
}
$scope.makesnapshot = function() {
  WebcamFactory.makesnapshot();
			}
});

// DIRECTIVE
// ngGroups : only to have an easy way to manage the template to show
// informations of each groups
app.directive('ngGroups', function(){
  return{
    restrict:'A'
    ,templateUrl:'partials/templates/groupsTpl.html'
  }
});

// DIRECTIVE
// ngPlayers : only to have an easy way to manage the template to show
// informations of each players
app.directive('ngPlayers', function(){
  return{
    restrict:'A'
    ,templateUrl:'partials/templates/playersTpl.html'
  }
});

// FACTORY
// GROUPSFACTORY : used to managed groups
app.factory('GroupsFactory',function($http,$q){
	var factory={
		groups : false,
		players : false,
		getGroups : function(){
									var deferred = $q.defer();
									$http.get("ajax/groups_list.php")
									.success(function(data,statut){
										factory.groups = data;
										deferred.resolve(factory.groups);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les groupes');
									})
									return deferred.promise;
								},
		getGroupsPlayers : function(){
									var deferred = $q.defer();
									$http.get("ajax/groups_players_list.php")
									.success(function(data,statut){
										factory.players = data;
										deferred.resolve(factory.players);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les joueurs');
									})
									return deferred.promise;
								},
		getGroup : function(id){
									group={};
									angular.forEach(factory.groups, function(value, key) {
									  if(value.GROUPS_ID==id){group=value}
									});
									return group;
								},
		remGroup : function(id){
									var deferred = $q.defer();
									$http.post("ajax/groups_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le groupe');
									})
									return deferred.promise;
								},
		addGroup : function(NG){
									var deferred=$q.defer();
									$http.post("ajax/groups_insert.php",NG)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d ajouter un groupe');
									})
									return deferred.promise;
								},
		editGroup : function(id,NG){}
	}
	return factory;
})

// FACTORY
// PLAYERSFACTORY : used to managed players
app.factory('PlayersFactory',function($http,$q){
	var factory={
		players : false,
		getPlayers : function(){
									var deferred = $q.defer();
									$http.get("ajax/players_list.php")
									.success(function(data,statut){
										factory.players = data;
										deferred.resolve(factory.players);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les joueurs');
									})
									return deferred.promise;
								},
		getPlayer : function(id){
									player={};
									angular.forEach(factory.players, function(value, key) {
									  if(value.PLAYERS_ID==id){player=value}
									});
									return player;
								},
		remPlayer : function(id,picture){
									var deferred = $q.defer();
									$http.post("ajax/players_delete.php",
						                   {id:id,picture:picture
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le joueur');
									})
									return deferred.promise;
								},
		addPlayer : function(NP){
									var deferred=$q.defer();
									$http.post("ajax/players_insert.php",NP)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter un joueur');
									})
									return deferred.promise;
								},
		editPlayer : 	function(UP){
										var deferred=$q.defer();
										$http.post("ajax/players_update.php",UP)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible d\'editer un joueur');
										})
										return deferred.promise;
									},
		updatePicture : function(id,picture,base64){
										var deferred=$q.defer();
										$http.post('ajax/players_update_picture.php',{id:id,picture:picture,base64:base64})
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(){
											deferred.reject('Impossible de changer la photo');
										})
										return deferred.promise;
								}
	}
	return factory;
})

// FACTORY
// REPLICASFACTORY : used to managed replicas
app.factory('ReplicasFactory',function($http,$q){
	var factory={
		replicas : false,
		getReplicas : function(){
			var deferred = $q.defer();
			$http.get("ajax/replicas_list.php")
			.success(function(data,statut){
				factory.replicas = data;
				deferred.resolve(factory.replicas);
			})
			.error(function(data,statut){
				deferred.reject('Impossible de charger les répliques');
			})
			return deferred.promise;
		},
		getReplica : function(id){
			return factory.replicas[id];
		},
		remReplica : function(id,picture){
			var deferred = $q.defer();
			$http.post("ajax/replicas_delete.php",
                   {id:id,picture:picture
                }
            )
			.success(function(data,statut){
				deferred.resolve();
			})
			.error(function(data,statut){
				deferred.reject('Impossible de supprimer la réplique');
			})
			return deferred.promise;
		},
		addReplica : function(NR){
			var deferred = $q.defer();
			$http.post("ajax/replicas_insert.php",NR)
			.success(function(data,statut){
				deferred.resolve(data);
			})
			.error(function(data,statut){
				deferred.reject('Impossible d ajouter une réplique');
			})
			return deferred.promise;
		},
		editReplica : function(id){

		},
		updatePicture : function(id,picture,base64){
			var deferred=$q.defer();
			$http.post('ajax/replicas_update_picture.php',{id:id,picture:picture,base64:base64})
			.success(function(data,statut){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject('Impossible de changer la photo');
			})
			return deferred.promise;
	}
	}
	return factory;
})

// FACTORY
// WEBCAMFACTORY : used to managed the webcam with all Controllers
app.factory('WebcamFactory',function(){
  var factory={
  thecanvas : null,
  videolive : null,
  //video_success : function(webcam){
  //                	videolive=webcam;
  //                },
  makesnapshot : function() {
              			if (factory.videolive) {
                      var patCanvas = factory.thecanvas;
            					if (!patCanvas){return;}
            					patCanvas.width = factory.videolive.width;
            					patCanvas.height = factory.videolive.height;
            					var ctxPat = patCanvas.getContext('2d');
            					var idata = ctxPat.drawImage(factory.videolive,0,0,patCanvas.width,patCanvas.height);
            					return patCanvas.toDataURL();
                			}
                	}
}
return factory;
})
