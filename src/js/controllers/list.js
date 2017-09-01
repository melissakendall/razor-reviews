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

    //////////////// Sorting //////////////////////////////////////
    let sortMethod = "mealName";
    
    if($.urlParam("sort")) {
      sortMethod = $.urlParam("sort");
    }

    //Sort button handling
    $(".sort-button").click(function() {
      window.location.href = window.location.pathname + "#/list/?sort=" + $(this).attr("value");  
    });

    //////////////// Searching //////////////////////////////////////
    let searchValue = false;
    
    if($.urlParam("search")) {
      searchValue = $.urlParam("search");
    }

    //Sort button handling
    $("#search-form").submit(function() {
      window.location.href = window.location.pathname + "#/list/?sort=" + sortMethod + "&search=" + $("#search-input").val();  
    });


    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query;
    
    if(searchValue) {
      query = firebase.database().ref("user-meals/" + userId).orderByChild(sortMethod).equalTo(searchValue);
    } 
    else {
      query = firebase.database().ref("user-meals/" + userId).orderByChild(sortMethod);
    }

    query.once("value")
      .then(function(snapshot) {
        //showMore = Object.keys(snapshot.val()).length > 10;
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(childSnapshot) {
      var meal = childSnapshot.val();
      var html = '';
      
      html += '<li class="list-group-item meal">';
      html +=  '<div class="row">';
      html +=   '<div class="col-md-10">';
      html +=     '<h4>'+  meal.mealName +'</h4>';

      if(meal.rating) {

        for(var i = 0; i < 5; i++) {
          if(i < meal.rating)
            html +=     '<i class="fa fa-star star-rating" aria-hidden="true"></i>';
          else
            html +=     '<i class="fa fa-star-o star-rating" aria-hidden="true"></i>';            
        }
      }

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
