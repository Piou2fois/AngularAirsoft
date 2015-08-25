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

// CONTROLLER
// DatabasesCtrl : used to manage the groups
app.controller('DatabasesCtrl',function(
																			$scope
																			,DatabasesFactory
																			,LxNotificationService
																			,LxDialogService
																			,$route
																		)
																		{
$scope.selects = {
    selectedDatabase: undefined,// only way found there : http://stackoverflow.com/questions/27651125/lumx-lx-select-not-updating-ng-model
};
$scope.databases = DatabasesFactory.getDatabases()
											.then(function(databases)
														{
															$scope.databases=databases;
															LxNotificationService.success('La liste des bases de données a été chargée');
														},function(msg)
															{
																LxNotificationService.error(msg);
															}
													);

$scope.setDatabase =	function(database)
											{
												DatabasesFactory.setDatabase(database).then(function(msg){
													LxNotificationService.success('Le base de données à été chargée');
													$route.reload(); //refresh the data on database change
												}),function(msg)
														{
															LxNotificationService.error(msg)
														}
											};
$scope.opendDialog = 	function(dialogId)
											{
											    LxDialogService.open(dialogId);
											};
$scope.addDatabase = 	function(ND)
											{
													DatabasesFactory.addDatabase(ND)
													.then(function()
																{
																	newdb={name:ND,file:ND+'.db'};
																	$scope.databases=$scope.databases.concat(newdb);
																	LxNotificationService.success('La base de données à été créée, vous pouvez la sélectionner');
																}
																)
													,function(msg)
														{
															LxNotificationService.error(msg)
														}

											}

});

// CONTROLLER
// GroupsCtrl : used to manage the groups
app.controller('GroupsCtrl',function(
																			$scope
																			,$http
																			,$q
																			,$routeParams
																			,GroupsFactory
																			,WebcamFactory
																			,LxNotificationService
																			,LxDialogService
																		)
																		{
	$scope.params = $routeParams;
	$scope.groups={};
	$scope.players={};
	$scope.getGroupsPlayers = function(){GroupsFactory.getGroupsPlayers().then(function(players){
																					$scope.players=players;
																				},function(msg){
																												LxNotificationService.error(msg);
																											}
																										);
																			}
	$scope.getGroups = function(){GroupsFactory.getGroups().then(function(groups){
																																	$scope.groups=groups;
																																	$scope.group = GroupsFactory.getGroup($scope.params.id);
																																},function(msg){
																																								LxNotificationService.error(msg);
																																							}
																																						);
																															}
	$scope.getGroups();
	$scope.getGroupsPlayers();
	$scope.$watch('groups',function(){
																		$scope.nbgroups = $scope.groups.length;
																	},true);
	$scope.remGroup = function(group){
																					if (confirm('Voulez-vous supprimer ce groupe ?')){
																						idx=$scope.groups.indexOf(group);
																						GroupsFactory.remGroup(group.GROUPS_ID)
																						.then(function(){
																							$scope.groups.splice(idx,1);
																							LxNotificationService.success('Le groupe a bien été supprimé');
																						},function(msg){
																														LxNotificationService.error(msg);
																													}
																												);
																					}
																				};
  $scope.addGroup = function(NG){
																			  GroupsFactory.addGroup(NG).then(function(group){
																						$scope.groups=$scope.groups.concat(group);
																						NG={};
																						LxNotificationService.success('Le groupe a bien été ajouté');
																					},function(msg){
																													LxNotificationService.error(msg);
																												}
																				);
																			};
	$scope.updateGroupPicture = function(group){
																										if (confirm('Voulez-vous changer la photo ?')){
																										idx=$scope.groups.indexOf(group);
																										GroupsFactory.updateGroupPicture(group.GROUPS_ID,group.GROUPS_PICTURE,$scope.makesnapshot())
																										.then(function(picture_id){
																																								$scope.groups[idx].GROUPS_PICTURE=picture_id;
																																								LxNotificationService.success('La photo a bien été mise à jour');
																																							}
																													,function(msg){
																																					LxNotificationService.error(msg);
																																				}
																												);
																									}
																								};
	$scope.editGroup=function(group){
																					idx=$scope.groups.indexOf(group);
																					GroupsFactory.editGroup(group)
																					.then(function(){
																														$scope.groups[idx]=$scope.group;
																														LxNotificationService.success('Le groupe a bien été mis à jour');
																													}
																							)
																					,function(msg){
																													LxNotificationService.error(msg)
																												}
																				};

	$scope.makesnapshot = function() {
																		return WebcamFactory.makesnapshot();
																	};
	$scope.MoveToGroup = function(group_tgt) {
																										PlayersToMove=[];
																										angular.forEach($scope.players,function(value,key){
																											if(value.selected==true){
																												PlayersToMove.push(value.PLAYERS_ID);
																											}

																										});
																										GroupsFactory.MoveToGroup(group_tgt.GROUPS_ID,PlayersToMove)
																										.then(function(){
																														$scope.getGroupsPlayers();
																														LxNotificationService.success('Les modifications ont été prises en compte');
																										})
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
	$scope.players={};
	$scope.replicas={};
	$scope.getPlayers = function(){ PlayersFactory.getPlayers()
									.then(function(players){
																					$scope.players=players
																					$scope.player = PlayersFactory.getPlayer($scope.params.id);
																					LxNotificationService.success('Tous les joueurs ont été chargés');
																				}
																				,function(msg){
																												LxNotificationService.error(msg);
																											}
											);
										};
	$scope.getReplicas = function(){ReplicasFactory.getReplicas()
										.then(function(replicas){
																							$scope.replicas = replicas;
																							LxNotificationService.success('Toutes les répliques ont été chargées');
																						}
																						,function(msg){
																														LxNotificationService.error(msg);
																													}
												);
											};
	$scope.getPlayers();
	$scope.getReplicas();
	$scope.$watch('players',function(){
																			$scope.nbplayers = $scope.players.length;
																			},true
																		);
	$scope.remPlayer = function(player){
																						if (confirm('Voulez-vous supprimer ce joueur ?')){
																							idx=$scope.players.indexOf(player);
																							PlayersFactory.remPlayer(player)
																							.then(function(){
																																$scope.players.splice(idx,1);
																																LxNotificationService.success('Le joueur a bien été supprimé');
																															}
																						,function(msg){
																														LxNotificationService.error(msg);
																													});
																						}
																					};
  $scope.addPlayer = function(NP){
																		  	PlayersFactory.addPlayer(NR)
																				.then(function(player){
																																$scope.players=$scope.players.concat(player);
																																NR={};
																																LxNotificationService.success('Le joueur a bien été ajouté');
																															}
																				,function(msg){
																												LxNotificationService.error(msg);
																											});
																			};
	$scope.updatePlayerPicture = function(player){
																										if (confirm('Voulez-vous changer la photo ?')){
																										idx=$scope.players.indexOf(player);
																										PlayersFactory.updatePlayerPicture(player.PLAYERS_ID,player.PLAYERS_PICTURE,$scope.makesnapshot())
																										.then(function(picture_id){
																																								$scope.players[idx].PLAYERS_PICTURE=picture_id;
																																								LxNotificationService.success('La photo a bien été mise à jour');
																																							}
																													,function(msg){
																																					LxNotificationService.error(msg);
																																				}
																												);
																									}
																								};
$scope.editPlayer=function(player){
																				idx=$scope.players.indexOf(player);
																				PlayersFactory.editPlayer(player)
																				.then(function(){
																													$scope.players[idx]=$scope.player;
																													LxNotificationService.success('Le joueur a bien été mis à jour');
																													window.history.back();
																												}
																						)
																				,function(msg){
																												LxNotificationService.error(msg)
																											}
																			};
	$scope.makesnapshot = function() {
																		return WebcamFactory.makesnapshot();
																	};
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
																				,player
																				,LxNotificationService
																				,LxDialogService
																			)
																				{
	$scope.params = $routeParams;
	// $scope.players = players;
	// $scope.player = PlayersFactory.getPlayer($scope.params.id);
	$scope.player=player;
	$scope.replica_edited={};
	$scope.replicas={};
	$scope.getReplicas = function(){ReplicasFactory.getReplicas()
												.then(function(replicas){
													$scope.replicas=replicas;
													$scope.replica = ReplicasFactory.getReplica($scope.params.id);
													LxNotificationService.success('Toutes les répliques ont été chargées');
												}
												,function(msg)
												{
													LxNotificationService.error(msg);
												}
											);
											};
	$scope.getReplicas();
	$scope.addReplica = function(NR){
														ReplicasFactory.addReplica(NR)
														.then(function(replica){
															$scope.replicas=$scope.replicas.concat(replica);
															NR={};
															LxNotificationService.success('La réplique a été ajoutée');
														}
														,function(msg)
														{
															LxNotificationService.error(msg);
														}
													);
												  };
	$scope.editReplica=function(replica){
																			idx=$scope.replicas.indexOf(replica);
																			ReplicasFactory.editReplica(replica)
																			.then(function(){
																												$scope.replica[idx]=$scope.replica;
																												LxNotificationService.success('La réplique a bien été mise à jour');
																												window.history.back();
																											}
																					)
																			,function(msg){
																											LxNotificationService.error(msg)
																										}
																			};
	$scope.remReplica = function(replica){
														if (confirm('Voulez-vous supprimer cette réplique ?')){
															idx=$scope.replicas.indexOf(replica);
															ReplicasFactory.remReplica(replica)
															.then(function(){$scope.replicas.splice(idx,1)},function(msg){alert(msg);})};
														};
	$scope.updateReplicaPicture = function(replica){
																		if (confirm('Voulez-vous supprimer cette réplique ?')){
																			idx=$scope.replicas.indexOf(replica);
																			ReplicasFactory.updateReplicaPicture(replica.REPLICAS_ID,replica.REPLICAS_PICTURE,$scope.makesnapshot())
																			.then(function(picture_id){$scope.replicas[idx].REPLICAS_PICTURE=picture_id;},function(msg){alert(msg);});
																		};
																	};
	$scope.makesnapshot = function(){
													return WebcamFactory.makesnapshot();
													};
  });

// CONTROLLER
// ScriptsCtrl : used to manage the groups
app.controller('ScriptsCtrl',function(
																			$scope
																			,ScriptsFactory
																			,$sce
																			,$routeParams
																			,LxNotificationService
																			,LxDialogService
																		)
																		{
$scope.tinymceOptions = {
												  onChange: function(e) {
												    // put logic here for keypress and cut/paste changes
												  },
												  inline: false,
												  plugins : 'advlist lists charmap',
												  skin: 'lightgray',
												  theme : 'modern',
													// language : 'fr_FR',
													toolbar : 'bold italic underline',
													menubar : 'edit insert format',
													trusted:true
												};
$scope.params = $routeParams;
$scope.scripts={};
$scope.getScripts = function(){ScriptsFactory.getScripts()
								.then(function(scripts)
								{
									$scope.scripts=scripts
									$scope.script = ScriptsFactory.getScript($scope.params.id);
									LxNotificationService.success('Tous les scénarios ont été chargés');
								}
								,function(msg)
								{
									LxNotificationService.error(msg);
								}
								);
							};
$scope.getScripts();
$scope.updateHtml = function(html){
																      return $sce.trustAsHtml(html);
															    };
$scope.editScript=function(script){
																		idx=$scope.scripts.indexOf(script);
																		ScriptsFactory.editScript(script).then(function(){
																			$scope.scripts[idx]=$scope.script;
																			LxNotificationService.success('Le scénario a bien été mis à jour');
																			window.history.back();
																		},function(msg){
																			LxNotificationService.error(msg)
																		});
																	};
$scope.addScript = function(script){
																		ScriptsFactory.addScript(script)
																		.then(function(script)
																		{
																			$scope.scripts=$scope.scripts.concat(script);
																			LxNotificationService.success('Le scénario a bien été créé');
																			window.history.back();
																		}
																		,function(msg)
																		{
																			LxNotificationService.error(msg)
																		});
																	};
$scope.remScript = function(script){
																		if (confirm('Voulez-vous supprimer ce scénario ?')){
																			idx=$scope.scripts.indexOf(script);
																			ScriptsFactory.remScript(script.SCRIPTS_ID)
																			.then(function(){
																												$scope.scripts.splice(idx,1);
																												LxNotificationService.success('Le scénario a bien été supprimé');
																											}
																		,function(msg){
																										LxNotificationService.error(msg);
																									});
																		}
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
$scope.video_success = function(){
	WebcamFactory.videolive = $scope.C_identite.video;
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
// DatabasesFactory : used to managed databases
app.factory('DatabasesFactory',function($http,$q){
	var factory={
		databases : false,
		getDatabases : function(){
									var deferred = $q.defer();
									$http.get("ajax/databases_list.php")
									.success(function(data,statut){
										factory.databases = data;
										deferred.resolve(factory.databases);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'obtenir la liste des bases de données');
									})
									return deferred.promise;
								},
		setDatabase : function(database){
									var deferred = $q.defer();
									$http.post("ajax/databases_set.php",{database:database})
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de sélectionner une base de données');
									})
									return deferred.promise;
								},
		remDatabase : function(id){
									var deferred = $q.defer();
									$http.post("ajax/databases_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer la base de données');
									})
									return deferred.promise;
								},
		addDatabase : function(ND){
									var deferred=$q.defer();
									$http.post("ajax/databases_insert.php",{newdb:ND})
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter une base de données');
									})
									return deferred.promise;
								},
		renameDatabase : 	function(RD){
										var deferred=$q.defer();
										$http.post("ajax/databases_rename.php",RD)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible de renommer la base de données');
										})
										return deferred.promise;
									},
	}
	return factory;
})

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
		editGroup : function(group){
																var deferred=$q.defer();
																$http.post("ajax/groups_update.php",group)
																.success(function(data,statut){
																	deferred.resolve(data);
																})
																.error(function(data,statut){
																	deferred.reject('Impossible d\'editer un groupe');
																})
																return deferred.promise;
															},
		updateGroupPicture : function(id,picture,base64){
																									var deferred=$q.defer();
																									$http.post('ajax/groups_update_picture.php',{id:id,picture:picture,base64:base64})
																									.success(function(data,statut){
																										deferred.resolve(data);
																									})
																									.error(function(){
																										deferred.reject('Impossible de changer la photo');
																									})
																									return deferred.promise;
																							},
			MoveToGroup : function(groupId,PlayersToMove)	{
																											var deferred=$q.defer();
																											$http.post('ajax/players_MoveToGroup.php?groupId='+groupId,PlayersToMove)
																											.success(function(data,statut){
																												deferred.resolve(data);
																												console.log(data);
																											})
																											.error(function(data,statut){
																												console.log(data);
																												deferred.reject('Impossible de changer le groupe des joueurs sélectionnés');
																											})
																											return deferred.promise;
																										}
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
		remPlayer : function(replica){
									var deferred = $q.defer();
									$http.post("ajax/players_delete.php",replica)
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le joueur');
									})
									return deferred.promise;
								},
		addPlayer : function(player){
									var deferred=$q.defer();
									$http.post("ajax/players_insert.php",player)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter un joueur');
									})
									return deferred.promise;
								},
		editPlayer : 	function(player){
										var deferred=$q.defer();
										$http.post("ajax/players_update.php",player)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible d\'editer un joueur');
										})
										return deferred.promise;
									},
		updatePlayerPicture : function(id,picture,base64){
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
																replica={};
																angular.forEach(factory.replicas, function(value, key) {
																	if(value.REPLICAS_ID==id){replica=value}
																});
																return replica;
															},
		remReplica : function(replica){
																			var deferred = $q.defer();
																			$http.post("ajax/replicas_delete.php",replica)
																			.success(function(data,statut){
																				deferred.resolve();
																			})
																			.error(function(data,statut){
																				deferred.reject('Impossible de supprimer la réplique');
																			})
																			return deferred.promise;
																		},
		addReplica : function(replica){
															var deferred = $q.defer();
															$http.post("ajax/replicas_insert.php",replica)
															.success(function(data,statut){
																deferred.resolve(data);
															})
															.error(function(data,statut){
																deferred.reject('Impossible d ajouter une réplique');
															})
															return deferred.promise;
														},
		editReplica : function(replica){
																var deferred=$q.defer();
																$http.post("ajax/replicas_update.php",replica)
																.success(function(data,statut){
																	deferred.resolve(data);
																})
																.error(function(data,statut){
																	deferred.reject('Impossible d\'editer une réplique');
																})
																return deferred.promise;
															},
		updateReplicaPicture : function(id,picture,base64){
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
// ScriptsFactory : used to managed scripts
app.factory('ScriptsFactory',function($http,$q){
	var factory={
		scripts : false,
		getScripts : function(){
									var deferred = $q.defer();
									$http.get("ajax/scripts_list.php")
									.success(function(data,statut){
										factory.scripts = data;
										deferred.resolve(factory.scripts);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les scénarios');
									})
									return deferred.promise;
								},
		getScript : function(id){
									script={};
									angular.forEach(factory.scripts, function(value, key) {
									  if(value.SCRIPTS_ID==id){script=value}
									});
									return script;
								},
		remScript : function(id){
									var deferred = $q.defer();
									$http.post("ajax/scripts_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le scénario');
									})
									return deferred.promise;
								},
		addScript : function(script){
									var deferred=$q.defer();
									$http.post("ajax/scripts_insert.php",script)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter un scénario');
									})
									return deferred.promise;
								},
		editScript : 	function(script){
										var deferred=$q.defer();
										$http.post("ajax/scripts_update.php",script)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible d\'editer le scénario');
										})
										return deferred.promise;
									},
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
