// FACTORY
// DatabasesFactory : used to managed databases
app.factory('DatabasesFactory',function($http,$q){
	var factory={
		databases : false,
		getDatabases : function(){
									var deferred = $q.defer();
									$http.get("ajax/databases_list.php")
									.success(function(data,statut){
										factory.databases = data;
										deferred.resolve(factory.databases);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'obtenir la liste des bases de données');
									})
									return deferred.promise;
								},
		setDatabase : function(database){
									var deferred = $q.defer();
									$http.post("ajax/databases_set.php",{database:database})
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de sélectionner une base de données');
									})
									return deferred.promise;
								},
		remDatabase : function(id){
									var deferred = $q.defer();
									$http.post("ajax/databases_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer la base de données');
									})
									return deferred.promise;
								},
		addDatabase : function(ND){
									var deferred=$q.defer();
									$http.post("ajax/databases_insert.php",{newdb:ND})
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter une base de données');
									})
									return deferred.promise;
								},
		renameDatabase : 	function(RD){
										var deferred=$q.defer();
										$http.post("ajax/databases_rename.php",RD)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible de renommer la base de données');
										})
										return deferred.promise;
									},
	}
	return factory;
})
