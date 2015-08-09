// FACTORY
// WEBCAMFACTORY : used to managed the webcam with all Controllers
app.factory('WebcamFactory',function(){
  var factory={
  thecanvas : null,
  videolive : null,
  //video_success : function(webcam){
  //                	videolive=webcam;
  //                },
  makesnapshot : function() {
              			if (factory.videolive) {
                      var patCanvas = factory.thecanvas;
            					if (!patCanvas){return;}
            					patCanvas.width = factory.videolive.width;
            					patCanvas.height = factory.videolive.height;
            					var ctxPat = patCanvas.getContext('2d');
            					var idata = ctxPat.drawImage(factory.videolive,0,0,patCanvas.width,patCanvas.height);
            					return patCanvas.toDataURL();
                			}
                	}
}
return factory;
})
