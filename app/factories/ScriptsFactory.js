// FACTORY
// ScriptsFactory : used to managed scripts
app.factory('ScriptsFactory',function($http,$q){
	var factory={
		scripts : false,
		getScripts : function(){
									var deferred = $q.defer();
									$http.get("ajax/scripts_list.php")
									.success(function(data,statut){
										factory.scripts = data;
										deferred.resolve(factory.scripts);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les scénarios');
									})
									return deferred.promise;
								},
		getScript : function(id){
									script={};
									angular.forEach(factory.scripts, function(value, key) {
									  if(value.SCRIPTS_ID==id){script=value}
									});
									return script;
								},
		addScript : function(script){
									var deferred=$q.defer();
									$http.post("ajax/scripts_insert.php",script)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter un scénario');
									})
									return deferred.promise;
								},
		editScript : 	function(script){
										var deferred=$q.defer();
										$http.post("ajax/scripts_update.php",script)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible d\'editer le scénario');
										})
										return deferred.promise;
									},
		remScript : function(id){
									var deferred = $q.defer();
									$http.post("ajax/scripts_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le scénario');
									})
									return deferred.promise;
								},
	}
	return factory;
})
