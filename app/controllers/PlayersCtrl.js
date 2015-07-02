app.controller('PlayersCtrl',function($scope,$http,filterFilter,$q,PlayersFactory,ReplicasFactory) {
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
	$scope.players_delete = function(ID,picture,idx){
		PlayersFactory.remPlayer(ID,picture).then(function(){
			$scope.players.splice(idx,1);
		},function(msg){alert(msg);});
	};
  $scope.players_insert = function(NP){
		console.log(this);
        PlayersFactory.addPlayer(NP).then(function(player){$scope.players=$scope.players.concat(player);},function(msg){alert(msg);});
	};
	$scope.player_picture_update = function(id,picture,idx){
		PlayersFactory.updatePicture(id,picture,$scope.makesnapshot())
		.then(function(picture_id){$scope.players[idx].PLAYERS_PICTURE=picture_id;},function(msg){alert(msg);});
	};
  $scope.replicas_insert = function(NR){
		ReplicasFactory.addReplica(NR).then(function(replica){$scope.replicas=$scope.replicas.concat(replica);},function(msg){alert(msg);});
    };
	$scope.replicas_delete = function(replicas_ID,picture,idx){
		ReplicasFactory.remReplica(replicas_ID,picture).then(function(){$scope.replicas.splice(idx,1)},function(msg){alert(msg);})};
	$scope.replica_picture_update = function(id,picture,idx){
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
  };
	$scope.video_success = function(){
		mavideo = $scope.C_identite.video;
	}
	$scope.update_ID_picture = function(PLAYERS_ID,PLAYERS_PICTURE) {
		mavideo = $scope.C_identite.video;
        if (mavideo) {
			var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas){return;}
            patCanvas.width = mavideo.width;
            patCanvas.height = mavideo.height;
            var ctxPat = patCanvas.getContext('2d');
			var idata = getVideoData(0, 0, 320, 240,mavideo);
			ctxPat.putImageData(idata, 0, 0);
			$http.post("ajax/players_update_picture.php",{id:PLAYERS_ID,picture:PLAYERS_PICTURE,base64:patCanvas.toDataURL()})
			.success(function(response){
			deferred.resolve(response);
			})
			.error(function(){deferred.resolve(PLAYERS_PICTURE);
			})
		}
			$scope.recup=deferred.promise;
			return deferred.promise;
    };
	$scope.bordel=function(PLAYERS_ID){
		angular.forEach($scope.players, function(value){$scope.recup=value.LASTNAME})
	}
	$scope.makesnapshot = function() {
		mavideo = $scope.C_identite.video;
        if (mavideo) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas){return;}
            patCanvas.width = mavideo.width;
            patCanvas.height = mavideo.height;
            var ctxPat = patCanvas.getContext('2d');
			var idata = getVideoData(0, 0, 320, 240,mavideo);
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
