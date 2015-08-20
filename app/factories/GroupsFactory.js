// FACTORY
// GROUPSFACTORY : used to managed groups
app.factory('GroupsFactory',function($http,$q){
	var factory={
		groups : false,
		players : false,
		getGroups : function(){
									var deferred = $q.defer();
									$http.get("ajax/groups_list.php")
									.success(function(data,statut){
										factory.groups = data;
										deferred.resolve(factory.groups);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les groupes');
									})
									return deferred.promise;
								},
		getGroupsPlayers : function(){
									var deferred = $q.defer();
									$http.get("ajax/groups_players_list.php")
									.success(function(data,statut){
										factory.players = data;
										deferred.resolve(factory.players);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les joueurs');
									})
									return deferred.promise;
								},
		getGroup : function(id){
									group={};
									angular.forEach(factory.groups, function(value, key) {
									  if(value.GROUPS_ID==id){group=value}
									});
									return group;
								},
		remGroup : function(id){
									var deferred = $q.defer();
									$http.post("ajax/groups_delete.php",
						                   {id:id
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le groupe');
									})
									return deferred.promise;
								},
		addGroup : function(NG){
									var deferred=$q.defer();
									$http.post("ajax/groups_insert.php",NG)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d ajouter un groupe');
									})
									return deferred.promise;
								},
		editGroup : function(iNG){
																var deferred=$q.defer();
																$http.post("ajax/players_update.php",UP)
																.success(function(data,statut){
																	deferred.resolve(data);
																})
																.error(function(data,statut){
																	deferred.reject('Impossible d\'editer un groupe');
																})
																return deferred.promise;
															},
		updatePicture : function(id,picture,base64){
																									var deferred=$q.defer();
																									$http.post('ajax/players_update_picture.php',{id:id,picture:picture,base64:base64})
																									.success(function(data,statut){
																										deferred.resolve(data);
																									})
																									.error(function(){
																										deferred.reject('Impossible de changer la photo');
																									})
																									return deferred.promise;
																							}
	}
	return factory;
})
