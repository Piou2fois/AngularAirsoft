app.controller('GroupsCtrl',function($scope,$http,filterFilter,$q,$routeParams,PlayersFactory,GroupsFactory) {
	$scope.params = $routeParams;
	$scope.players = GroupsFactory.getGroupsPlayers().then(function(players){
										$scope.players=players;
									},function(msg){alert(msg);});
	$scope.groups = GroupsFactory.getGroups().then(function(groups){
										$scope.groups=groups;
										//'No Group' group creation for players with no group attributed
										empty={'GROUPS_DESCRIPTION':'Sans équipe','GROUPS_ID':null,'GROUPS_NAME':'Sans équipe'};
										groups.push(empty);
									},function(msg){alert(msg);});
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
