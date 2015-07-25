app.controller('ReplicasCtrl',function($scope,$http,filterFilter,$q,$routeParams,PlayersFactory,ReplicasFactory,WebcamFactory,players) {
	$scope.params = $routeParams;
	$scope.players = players;
	$scope.player = PlayersFactory.getPlayer($scope.params.player_id);
	$scope.replicas = ReplicasFactory.getReplicas().then(function(replicas){
		$scope.replicas=replicas;
	},function(msg){alert(msg);});
	$scope.replicas_insert = function(NR){
		ReplicasFactory.addReplica(NR).then(function(replica){$scope.replicas=$scope.replicas.concat(replica);},function(msg){alert(msg);});
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
		}
		$scope.MDLupdate=function(){componentHandler.upgradeAllRegistered();$scope.$emit('coucou');}
  });
