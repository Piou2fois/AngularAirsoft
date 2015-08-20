// CONTROLLER
// WebcamCtrl : used to manage the webcam.
app.controller('WebcamCtrl',function(
																			$scope
																			,WebcamFactory
																		)
																		{
$scope.C_identite = {
	video: null // Will reference the video element on success
};
WebcamFactory.thecanvas=document.querySelector('#snapshot');
$scope.video_success = function(){
	WebcamFactory.videolive = $scope.C_identite.video;
}
$scope.makesnapshot = function() {
  WebcamFactory.makesnapshot();
			}
});
