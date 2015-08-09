// CONTROLLER
// ScriptsCtrl : used to manage the groups
app.controller('ScriptsCtrl',function(
																			$scope
																			,ScriptsFactory
																		)
																		{
$scope.tinymceOptions = {
												  onChange: function(e) {
												    // put logic here for keypress and cut/paste changes
												  },
												  inline: false,
												  plugins : 'advlist lists charmap',
												  skin: 'lightgray',
												  theme : 'modern',
													language : 'fr_FR',
													toolbar : 'bold italic underline',
													menubar : 'edit insert format'
												};
$scope.scripts = ScriptsFactory.getScripts()
								.then(function(scripts){
									$scope.scripts=scripts
								},function(msg){alert(msg);});
});
