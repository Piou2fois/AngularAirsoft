app.factory('PlayersFactory',function($http,$q){
	var factory={
		players : false,
		getPlayers : function(){
									var deferred = $q.defer();
									$http.get("ajax/players_list.php")
									.success(function(data,statut){
										factory.players = data;
										deferred.resolve(factory.players);
									})
									.error(function(data,statut){
										deferred.reject('Impossible de charger les joueurs');
									})
									return deferred.promise;
								},
		getPlayer : function(id){
									player={};
									angular.forEach(factory.players, function(value, key) {
									  if(value.PLAYERS_ID==id){player=value}
									});
									return player;
								},
		remPlayer : function(id,picture){
									var deferred = $q.defer();
									$http.post("ajax/players_delete.php",
						                   {id:id,picture:picture
						                }
						            )
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le joueur');
									})
									return deferred.promise;
								},
		addPlayer : function(NP){
									var deferred=$q.defer();
									$http.post("ajax/players_insert.php",NP)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d ajouter un joueur');
									})
									return deferred.promise;
								},
		editPlayer : function(id,NP){},
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
