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
											.then(function(databases)
														{
															$scope.databases=databases;
															LxNotificationService.success('La liste des bases de données a été chargée');
														},function(msg)
															{
																LxNotificationService.error(msg);
															}
													);

$scope.setDatabase =	function(database)
											{
												DatabasesFactory.setDatabase(database).then(function(msg){
													LxNotificationService.success('Le base de données à été chargée');
													$route.reload(); //refresh the data on database change
												}),function(msg)
														{
															LxNotificationService.error(msg)
														}
											};
$scope.opendDialog = 	function(dialogId)
											{
											    LxDialogService.open(dialogId);
											};
$scope.addDatabase = 	function(ND)
											{
													DatabasesFactory.addDatabase(ND)
													.then(function()
																{
																	newdb={name:ND,file:ND+'db'};
																	$scope.databases=$scope.databases.concat(newdb);
																	LxNotificationService.success('La base de données à été créée, vous pouvez la sélectionner');
																}
																)
													,function(msg)
														{
															LxNotificationService.error(msg)
														}

											}

});
