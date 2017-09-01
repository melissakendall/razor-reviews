var firebase = require('firebase');
var $ = require('jquery');

var ListController = function(Auth, redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query = firebase.database().ref("user-razors/" + userId).orderByChild("razorName");
    
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(childSnapshot) {
      var razor = childSnapshot.val();
      var html = '';
      
      html += '<li class="list-group-item razor">';
      html +=  '<div class="row">';
      html +=   '<div class="col-md-10">';
      html +=     '<h4>'+  razor.razorName +'</h4>';

      if(razor.rating) {

        for(var i = 0; i < 5; i++) {
          if(i < razor.rating)
            html +=     '<i class="fa fa-star star-rating" aria-hidden="true"></i>';
          else
            html +=     '<i class="fa fa-star-o star-rating" aria-hidden="true"></i>';            
        }
      }

      html +=   '</div>';
      html +=   '<div class="col-md-2">';
      html +=     '<a class="pull-right" href="#/razors/'+childSnapshot.key+'/edit">Edit</a>';        
      html +=   '</div>';
      html +=  '</div>';
      html += '</li>';

      markup += html;
    }
  }
}

module.exports = ListController;
