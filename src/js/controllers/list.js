var firebase = require('firebase');
var $ = require('jquery');

var ListController = function(Auth, redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query = firebase.database().ref("meals").limitToFirst(20);
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(childSnapshot) {
      var meal = childSnapshot.val();
      var html = '';
      
      html += '<li class="list-group-item meal">';
      html +=  '<div class="row">';
      html +=   '<div class="col-md-3">';

      if(meal.picture)
        html +=     '<img src="'+meal.picture+'" style="max-height:70px;max-width:100px"></img>';

      html +=   '</div>';
      html +=   '<div class="col-md-7">';
      html +=     '<h4>'+  meal.mealName +'</h4>';
      html +=     '<h5>'+  meal.date +'</h5>';
      html +=   '</div>';
      html +=   '<div class="col-md-2">';
      html +=     '<a class="pull-right" href="#/edit/'+childSnapshot.key+'">Edit</a>';        
      html +=   '</div>';
      html +=  '</div>';
      html += '</li>';

      markup += html;
    }
  }
}

module.exports = ListController;
