app.controller('ReplicasCtrl',function($scope,$http,filterFilter,$q,PlayersFactory,ReplicasFactory,$routeParams,players) {
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
