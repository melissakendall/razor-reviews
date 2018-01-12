var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();

    function saveGame(game) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('user-games/' + uid).push().key;

      // Write the new post's data simultaneously in both lists and the user's post list.
      var updates = {};
      updates['/user-games/' + uid + '/' + newPostKey] = game;

      return firebase.database().ref().update(updates);
    }

    $(document)
      .off('click', '#save')
      .on('click', '#save', function(e) {

        var uid = firebase.auth().currentUser.uid;

        var game = {
          gameName: $('#gameName').val(),
          notes: $('#notes').val(),
          serial: $('#serial').val(),
          console: $('#console').val(),          
          date: $('#date').val(),
          picture: $('#picture').val(),
          rating: $('#rating').val(),
          uid: uid
        }
        var response = saveGame(game).then(function(){
          redirect('games/list');
        });  

      });
  }
}

