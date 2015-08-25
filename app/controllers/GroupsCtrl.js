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
