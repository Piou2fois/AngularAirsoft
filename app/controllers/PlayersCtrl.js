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
