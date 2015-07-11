app.controller('PlayersCtrl',function($scope,$http,filterFilter,$q,PlayersFactory,ReplicasFactory,$routeParams) {
	$scope.params = $routeParams;
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
	$scope.players_delete = function(player){
		if (confirm('Voulez-vous supprimer ce joueur ?')){
			idx=$scope.players.indexOf(player);
			PlayersFactory.remPlayer(player.PLAYERS_ID,player.PLAYERS_PICTURE).then(function(){
				$scope.players.splice(idx,1);
			},function(msg){alert(msg);});
		}
	};
  $scope.players_insert = function(NP){
		console.log(NP);
        PlayersFactory.addPlayer(NP).then(function(player){$scope.players=$scope.players.concat(player);NP={};},function(msg){alert(msg);});
	};
	$scope.player_picture_update = function(player){
		idx=$scope.players.indexOf(player);
		PlayersFactory.updatePicture(player.PLAYERS_ID,player.PLAYERS_PICTURE,$scope.makesnapshot())
		.then(function(picture_id){$scope.players[idx].PLAYERS_PICTURE=picture_id;},function(msg){alert(msg);});
	};
  $scope.replicas_insert = function(NR){
		console.log(NR);
		ReplicasFactory.addReplica(NR).then(function(replica){$scope.replicas=$scope.replicas.concat(replica);},function(msg){alert(msg);});
    };
	$scope.replicas_delete = function(replicas_ID,picture,obj){
		idx=$scope.replicas.indexOf(obj);
		ReplicasFactory.remReplica(replicas_ID,picture).then(function(){$scope.replicas.splice(idx,1)},function(msg){alert(msg);})};
	$scope.replica_picture_update = function(id,picture,obj){
		idx=$scope.replicas.indexOf(obj);
		ReplicasFactory.updatePicture(id,picture,$scope.makesnapshot())
		.then(function(picture_id){$scope.replicas[idx].REPLICAS_PICTURE=picture_id;},function(msg){alert(msg);});
	};


    $scope.filter_replica = function(ID){
		if ($scope.replica_PLAYERS_ID==ID)
		{$scope.replica_PLAYERS_ID=0;
		$scope.replica_peekaboo=false;}
		else
		{$scope.replica_PLAYERS_ID=ID;
		$scope.replica_peekaboo=true;}

	}
	$scope.C_identite = {

		video: null // Will reference the video element on success
  };
	$scope.video_success = function(){
		mavideo = $scope.C_identite.video;
	}

	$scope.makesnapshot = function() {
		mavideo = $scope.C_identite.video;
        if (mavideo) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas){return;}
            patCanvas.width = mavideo.width;
            patCanvas.height = mavideo.height;
            var ctxPat = patCanvas.getContext('2d');
			var idata = getVideoData(0, 0, mavideo.width, mavideo.height,mavideo);
            ctxPat.putImageData(idata, 0, 0);
			return patCanvas.toDataURL();
        }
    };
	var getVideoData = function getVideoData(x, y, w, h,the_video) {
		var hiddenCanvas = document.createElement('canvas');
		hiddenCanvas.width = the_video.width;
		hiddenCanvas.height = the_video.height;
		var ctx = hiddenCanvas.getContext('2d');
		ctx.drawImage(the_video, 0, 0, the_video.width, the_video.height);
		return ctx.getImageData(x, y, w, h);
    };
  });
