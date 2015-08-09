// DIRECTIVE
// ngGroups : only to have an easy way to manage the template to show
// informations of each groups
app.directive('ngGroups', function(){
  return{
    restrict:'A'
    ,templateUrl:'partials/templates/groupsTpl.html'
  }
});
