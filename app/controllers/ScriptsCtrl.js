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
													// language : 'fr_FR',
													toolbar : 'bold italic underline',
													menubar : 'edit insert format',
													trusted:true
												};
$scope.params = $routeParams;
$scope.scripts={};
$scope.getScripts = function(){ScriptsFactory.getScripts()
								.then(function(scripts)
								{
									$scope.scripts=scripts
									$scope.script = ScriptsFactory.getScript($scope.params.id);
									LxNotificationService.success('Tous les scénarios ont été chargés');
								}
								,function(msg)
								{
									LxNotificationService.error(msg);
								}
								);
							};
$scope.getScripts();
$scope.updateHtml = function(html){
																      return $sce.trustAsHtml(html);
															    };
$scope.editScript=function(script){
																		idx=$scope.scripts.indexOf(script);
																		ScriptsFactory.editScript(script).then(function(){
																			$scope.scripts[idx]=$scope.script;
																			LxNotificationService.success('Le scénario a bien été mis à jour');
																			window.history.back();
																		},function(msg){
																			LxNotificationService.error(msg)
																		});
																	};
$scope.addScript = function(script){
																		ScriptsFactory.addScript(script)
																		.then(function()
																		{
																			$scope.scripts=$scope.scripts.concat(script);
																			LxNotificationService.success('Le scénario a bien été créé');
																			window.history.back();
																		}
																		,function(msg)
																		{
																			LxNotificationService.error(msg)
																		});
																	};
$scope.remScript = function(script){
																		if (confirm('Voulez-vous supprimer ce scénario ?')){
																			idx=$scope.scripts.indexOf(script);
																			ScriptsFactory.remScript(script.SCRIPTS_ID)
																			.then(function(){
																												$scope.scripts.splice(idx,1);
																												LxNotificationService.success('Le scénario a bien été supprimé');
																											}
																		,function(msg){
																										LxNotificationService.error(msg);
																									});
																		}
																	};
});
