// CONTROLLER
// DatabasesCtrl : used to manage the groups
app.controller('DatabasesCtrl',function(
																			$scope
																			,DatabasesFactory
																			,LxNotificationService
																			,LxDialogService
																			,$route
																		)
																		{
$scope.selects = {
    selectedDatabase: undefined,// only way found there : http://stackoverflow.com/questions/27651125/lumx-lx-select-not-updating-ng-model
};
$scope.databases = DatabasesFactory.getDatabases()
								.then(function(databases){
									$scope.databases=databases
									LxNotificationService.success('La liste des bases de données a été chargée');
								},function(msg){LxNotificationService.error(msg);});
$scope.setDatabase=function(database){
	DatabasesFactory.setDatabase(database).then(function(msg){
		LxNotificationService.success('Le base de données à été chargée');
		$route.reload(); //refresh the data on database change
	}),function(msg){alert(msg)}
}
});
