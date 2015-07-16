app.controller('WebcamCtrl',function($scope,WebcamFactory) {
$scope.C_identite = {
	video: null // Will reference the video element on success
};
WebcamFactory.thecanvas=document.querySelector('#snapshot');
console.log(WebcamFactory.thecanvas);
$scope.video_success = function(){
	WebcamFactory.videolive = $scope.C_identite.video;
  console.log(WebcamFactory);
}
$scope.makesnapshot = function() {
  WebcamFactory.makesnapshot();
			}
});
