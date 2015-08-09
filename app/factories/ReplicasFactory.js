// FACTORY
// REPLICASFACTORY : used to managed replicas
app.factory('ReplicasFactory',function($http,$q){
	var factory={
		replicas : false,
		getReplicas : function(){
			var deferred = $q.defer();
			$http.get("ajax/replicas_list.php")
			.success(function(data,statut){
				factory.replicas = data;
				deferred.resolve(factory.replicas);
			})
			.error(function(data,statut){
				deferred.reject('Impossible de charger les répliques');
			})
			return deferred.promise;
		},
		getReplica : function(id){
			return factory.replicas[id];
		},
		remReplica : function(id,picture){
			var deferred = $q.defer();
			$http.post("ajax/replicas_delete.php",
                   {id:id,picture:picture
                }
            )
			.success(function(data,statut){
				deferred.resolve();
			})
			.error(function(data,statut){
				deferred.reject('Impossible de supprimer la réplique');
			})
			return deferred.promise;
		},
		addReplica : function(NR){
			var deferred = $q.defer();
			$http.post("ajax/replicas_insert.php",NR)
			.success(function(data,statut){
				deferred.resolve(data);
			})
			.error(function(data,statut){
				deferred.reject('Impossible d ajouter une réplique');
			})
			return deferred.promise;
		},
		editReplica : function(id){

		},
		updatePicture : function(id,picture,base64){
			var deferred=$q.defer();
			$http.post('ajax/replicas_update_picture.php',{id:id,picture:picture,base64:base64})
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
