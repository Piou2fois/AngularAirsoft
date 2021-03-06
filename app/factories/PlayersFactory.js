// FACTORY
// PLAYERSFACTORY : used to managed players
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
		addPlayer : function(player){
									var deferred=$q.defer();
									$http.post("ajax/players_insert.php",player)
									.success(function(data,statut){
										deferred.resolve(data);
									})
									.error(function(data,statut){
										deferred.reject('Impossible d\'ajouter un joueur');
									})
									return deferred.promise;
								},
		editPlayer : 	function(player){
										var deferred=$q.defer();
										$http.post("ajax/players_update.php",player)
										.success(function(data,statut){
											deferred.resolve(data);
										})
										.error(function(data,statut){
											deferred.reject('Impossible d\'editer un joueur');
										})
										return deferred.promise;
									},
		remPlayer : function(replica){
									var deferred = $q.defer();
									$http.post("ajax/players_delete.php",replica)
									.success(function(data,statut){
										deferred.resolve();
									})
									.error(function(data,statut){
										deferred.reject('Impossible de supprimer le joueur');
									})
									return deferred.promise;
								},
		updatePlayerPicture : function(id,picture,base64){
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
