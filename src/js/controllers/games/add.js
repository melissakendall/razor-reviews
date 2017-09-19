var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();
    var FILE_URL = '';

    function prepareGame() {
        var uid = firebase.auth().currentUser.uid;

        var game = {
          gameName: $('#gameName').val(),
          notes: $('#notes').val(),
          serial: $('#serial').val(),
          console: $('#console').val(),          
          date: $('#date').val(),
          picture: FILE_URL,
          rating: $('#rating').val(),
          uid: uid
        }
        var response = saveGame(game).then(function(){
          redirect('games/list');
        });  
    }

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
      .off('click', '#add')
      .on('click', '#add', function(e) {

        var imgurToken = getCookie("imgurToken");
        var fileData = $('#picture')[0].files[0];

        //Imgur turned off, dont even try to upload
        if(!imgurToken || !fileData)
          prepareGame();

        $.ajax({
          async: true,
          url: 'https://api.imgur.com/3/image',
          processData: false,
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + getCookie("imgurToken"),
            Accept: 'application/json'
          },
          data: fileData,
          success: function(result) {
            FILE_URL = result.data.link;
            e.target.classList.remove("btn-danger");
            e.target.classList.add("btn-success");

            //Now move on
            prepareGame();
          },
          error: function(err) {
            console.log(err);
            e.target.classList.add("btn-danger");
            e.target.classList.remove("btn-success");
          }
        });
      });
  }
}

