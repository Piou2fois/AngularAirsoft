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
	$scope.players = GroupsFactory.getGroupsPlayers().then(function(players){
										$scope.players=players;
									},function(msg){alert(msg);});

	$scope.groups = GroupsFactory.getGroups().then(function(groups){
																																	$scope.groups=groups;
																																	//'No Group' group creation for players with no group attributed
																																	empty={'GROUPS_DESCRIPTION':'Liste des joueurs sans groupe','GROUPS_ID':null,'GROUPS_NAME':'Sans groupe'};
																																	groups.push(empty);
																																	$scope.group = GroupsFactory.getGroup($scope.params.id);
																																},function(msg){alert(msg);});
	$scope.$watch('players',function(){
																		$scope.nbgroups = $scope.groups.length;
																	},true);
	$scope.onDropComplete=function(data,GROUPS_ID){
																									data.GROUPS_ID=GROUPS_ID;
																								};

	$scope.groups_delete = function(group){
																					if (confirm('Voulez-vous supprimer ce groupe ?')){
																						idx=$scope.groups.indexOf(group);
																						GroupsFactory.remGroup(group.GROUPS_ID).then(function(){
																							$scope.groups.splice(idx,1);
																							LxNotificationService.success('Le groupe a bien été supprimé');
																						},function(msg){alert(msg);});
																					}
																				};
  $scope.groups_insert = function(NG){
																			  GroupsFactory.addGroup(NG).then(function(group){
																						$scope.groups=$scope.groups.concat(group);
																						NG={};
																						LxNotificationService.success('Le groupe a bien été ajouté');
																					},function(msg){alert(msg);}
																				);
																			};
	$scope.group_picture_update = function(group){
																										if (confirm('Voulez-vous changer la photo ?')){
																										idx=$scope.groups.indexOf(group);
																										GroupsFactory.updatePicture(group.GROUPS_ID,group.GROUPS_PICTURE,$scope.makesnapshot())
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
	$scope.groups_update=function(group){
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

});
