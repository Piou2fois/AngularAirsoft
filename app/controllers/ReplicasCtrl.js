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
	$scope.replica_edited=[];
	$scope.replicas=[];
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
															window.history.back();
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
