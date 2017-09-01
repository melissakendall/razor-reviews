var firebase = require('firebase');
var $ = require('jquery');

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

var ListController = function(Auth, redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    let sortMethod = "gameName";
    let searchValue = false;
    
    if($.urlParam("search")) {
      searchValue = $.urlParam("search");
    }

    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query;
    
    if(searchValue) {
      query = firebase.database().ref("user-games/" + userId).orderByChild(sortMethod).equalTo(searchValue);
    } 
    else {
      query = firebase.database().ref("user-games/" + userId).orderByChild(sortMethod);
    }

    query.once("value")
      .then(function(snapshot) {
        //showMore = Object.keys(snapshot.val()).length > 10;
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(childSnapshot) {
      var game = childSnapshot.val();
      var html = '';
      
      html += '<li class="list-group-item game">';
      html +=  '<div class="row">';
      html +=   '<div class="col-md-10">';
      html +=     '<h4>'+  game.gameName +'</h4>';

      if(game.rating) {

        for(var i = 0; i < 5; i++) {
          if(i < game.rating)
            html +=     '<i class="fa fa-star star-rating" aria-hidden="true"></i>';
          else
            html +=     '<i class="fa fa-star-o star-rating" aria-hidden="true"></i>';            
        }
      }

      html +=   '</div>';
      html +=   '<div class="col-md-2">';
      html +=     '<a class="pull-right" href="#/games/'+childSnapshot.key+'/edit">Edit</a>';        
      html +=   '</div>';
      html +=  '</div>';
      html += '</li>';

      markup += html;
    }
  }
}

module.exports = ListController;
