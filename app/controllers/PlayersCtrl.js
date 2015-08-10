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
		LxNotificationService.success('Tous les joueurs ont été chargés');
	},function(msg){alert(msg);});
	$scope.replicas = ReplicasFactory.getReplicas().then(function(replicas){
		$scope.replicas = replicas;
		LxNotificationService.success('Toutes les répliques ont été chargées');
	},function(msg){alert(msg);});
	$scope.$watch('players',function(){
		$scope.nbplayers = $scope.players.length;
		},true
	);
	$scope.players_edit=function(player,dialogId){
		$scope.player_edited=angular.copy(player);
		LxDialogService.open(dialogId);
	};
	$scope.players_delete = function(player){
		if (confirm('Voulez-vous supprimer ce joueur ?')){
			idx=$scope.players.indexOf(player);
			PlayersFactory.remPlayer(player.PLAYERS_ID,player.PLAYERS_PICTURE).then(function(){
				$scope.players.splice(idx,1);
				LxNotificationService.success('Le jour a bien été supprimé');
			},function(msg){alert(msg);});
		}
	};
  $scope.players_insert = function(NP){
	  PlayersFactory.addPlayer(NP).then(function(player){$scope.players=$scope.players.concat(player);NP={};LxNotificationService.success('Le joueur a bien été ajouté');},function(msg){LxNotificationService.error(msg);});
	};
	$scope.player_picture_update = function(player){
		if (confirm('Voulez-vous changer la photo ?')){
		idx=$scope.players.indexOf(player);
		PlayersFactory.updatePicture(player.PLAYERS_ID,player.PLAYERS_PICTURE,$scope.makesnapshot())
		.then(function(picture_id){
			$scope.players[idx].PLAYERS_PICTURE=picture_id;
			LxNotificationService.success('La photo a bien été mise à jour');
		},function(msg){alert(msg);});
	}
};
	$scope.makesnapshot = function() {
		return WebcamFactory.makesnapshot();
	}
});
