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
