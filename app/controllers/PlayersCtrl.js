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
																			,$interval
																		)
																		{
	$scope.params = $routeParams;
	$scope.players=[];
	$scope.replicas=[];
	$scope.player=[];
	$scope.tempo=[];
	var timer=$interval(function(){
		PlayersFactory.getPlayers()
										.then(function(players){
											if (!(angular.equals($scope.tempo,players))) {
												LxNotificationService.warning('La liste des joueurs a changé');
											}
										},function(){});
},10000);
	$scope.$on('$destroy',function(){
		$interval.cancel(timer);
	});
	$scope.getPlayers = function(){ PlayersFactory.getPlayers()
									.then(function(players){
																					$scope.players=players;
																					$scope.tempo=players;
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
  $scope.addPlayer = function(player){
																		  	PlayersFactory.addPlayer(player)
																				.then(function(player){
																																$scope.players=$scope.players.concat(player);
																																LxNotificationService.success('Le joueur a bien été ajouté');
																																window.history.back();
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
	$scope.opendDialog = function(dialogId)
																	{
																	    LxDialogService.open(dialogId);

																	};
	$scope.closingDialog = function()
																	{
																	    clearInterval(interval_id);
																			console.log('coucou');
																	};
	interval_id = '';
	$scope.$on('lx-dialog__open-end',function (event, data) {
																		interval_id = setInterval("snap()", 33);
																  });
	snap = function(){
		var canvas = document.getElementById('live');
		canvas.width = WebcamFactory.videolive.width;
		canvas.height = WebcamFactory.videolive.height;
		var context = canvas.getContext('2d');
		context.drawImage(WebcamFactory.videolive,0,0,WebcamFactory.videolive.width,WebcamFactory.videolive.height)
	};
});
