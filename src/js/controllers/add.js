var $ = require('jquery');
var firebase = require('firebase');
module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();

    function saveMeal(meal) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('meals').push().key;

      // Write the new post's data simultaneously in both lists and the user's post list.
      var updates = {};
      updates['/meals/' + newPostKey] = meal;
      updates['/user-meals/' + uid + '/' + newPostKey] = meal;

      return firebase.database().ref().update(updates);
    }

    $(document)
      .off('click', '#add')
      .on('click', '#add', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var meal = {
          mealName: $('#mealName').val(),
          notes: $('#notes').val(),
          ate: $('#ate').val(),
          date: $('#date').val(),
          picture: $('#picture').val(),
          rating: $('#rating').val(),
          uid: uid
        }
        var response = saveMeal(meal).then(function(){
          redirect('list');
        });        
      })
  }
}

