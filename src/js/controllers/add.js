var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();
    var FILE_URL = '';
    var IMGUR_API_KEY = '';

    //Still insecure, but better then hardcoding!
    var query = firebase.database().ref('secrets/4c149f04-c381-457');
    query.once("value").then(fillData);

    function fillData(snap) {
      var data = snap.val();
      IMGUR_API_KEY = data.secret;
    }

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
      .on('click', '#uploadImage', function(e) {

        var fileData = $('#picture')[0].files[0];
        
        if(!fileData)
          return;

        $.ajax({
          async: true,
          url: 'https://api.imgur.com/3/image',
          processData: false,
          method: 'POST',
          headers: {
            Authorization: 'Client-ID ' + IMGUR_API_KEY,
            Accept: 'application/json'
          },
          data: fileData,
          success: function(result) {
            FILE_URL = result.data.link;
            e.target.classList.remove("btn-danger");
            e.target.classList.add("btn-success");
          },
          error: function(err) {
            console.log(err);
            e.target.classList.add("btn-danger");
            e.target.classList.remove("btn-success");
          }
        });

      })
      .off('click', '#add')
      .on('click', '#add', function(e) {
        var uid = firebase.auth().currentUser.uid;

        var meal = {
          mealName: $('#mealName').val(),
          notes: $('#notes').val(),
          ate: $('#ate').val(),
          date: $('#date').val(),
          picture: FILE_URL,
          rating: $('#rating').val(),
          uid: uid
        }
        var response = saveMeal(meal).then(function(){
          redirect('list');
        });        
      })
  }
}

