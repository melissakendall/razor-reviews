var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();
    var FILE_URL = '';

    function prepareRazor() {
        var uid = firebase.auth().currentUser.uid;

        var razor = {
          razorName: $('#razorName').val(),
          notes: $('#notes').val(),
          date: $('#date').val(),
          picture: FILE_URL,
          rating: $('#rating').val(),
          uses: $('#uses').val(),          
          uid: uid
        }
        var response = saveRazor(razor).then(function(){
          redirect('razors/list');
        });  
    }

    function saveRazor(razor) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('user-razors/' + uid).push().key;

      // Write the new post's data simultaneously in both lists and the user's post list.
      var updates = {};
      updates['/user-razors/' + uid + '/' + newPostKey] = razor;

      return firebase.database().ref().update(updates);
    }

    $(document)
      .off('click', '#add')
      .on('click', '#add', function(e) {

        var imgurToken = getCookie("imgurToken");
        var fileData = $('#picture')[0].files[0];

        //Imgur turned off, dont even try to upload
        if(!imgurToken || !fileData)
          prepareRazor();

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
            prepareRazor();
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

