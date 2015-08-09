// DIRECTIVE
// ngPlayers : only to have an easy way to manage the template to show
// informations of each players
app.directive('ngPlayers', function(){
  return{
    restrict:'A'
    ,templateUrl:'partials/templates/playersTpl.html'
  }
});
