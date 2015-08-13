// CONTROLLER
// ScriptsCtrl : used to manage the groups
app.controller('ScriptsCtrl',function(
																			$scope
																			,ScriptsFactory
																			,$sce
																			,$routeParams
																			,LxNotificationService
																			,LxDialogService
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
													menubar : 'edit insert format',
													trusted:true
												};
$scope.params = $routeParams;
$scope.scripts = ScriptsFactory.getScripts()
								.then(function(scripts){
									$scope.scripts=scripts
									$scope.script = ScriptsFactory.getScript($scope.params.id);
									LxNotificationService.success('Tous les scénarios ont été chargés');
								},function(msg){LxNotificationService.error(msg);});
$scope.updateHtml = function(html) {
      return $sce.trustAsHtml(html);
    };
$scope.scripts_update=function(script){
	idx=$scope.scripts.indexOf(script);
	ScriptsFactory.editScript(script).then(function(){
		$scope.scripts[idx]=$scope.script;
		LxNotificationService.success('Le scénario a bien été mis à jour');
	}),function(msg){alert(msg)}
}
});
