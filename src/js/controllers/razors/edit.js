var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function (params) {
    // Get a reference to the database service
    var database = firebase.database();
    var uid = firebase.auth().currentUser.uid;
    var query = firebase.database().ref("user-razors/" + uid + "/" + params.id);

    //Fire Query
    query.once("value").then(fillData)

    //Fill The data
    function fillData(snap) {
      var data = snap.val();
      $('#razorName').val(data.razorName);
      $('#notes').val(data.notes);
      $('#date').val(data.date);
      $('#picture').val(data.picture);
      $('#picture-display').attr('src', data.picture);
      $('#rating').val(data.rating);
      $('#uses').val(data.uses);
    }

    //Save function
    function saveRazor(razor) {
      var uid = firebase.auth().currentUser.uid;
      var postKey = params.id;
      var updates = {};
      updates['/user-razors/' + uid + '/' + postKey] = razor;

      return database.ref().update(updates);
    }

    $(document)
      .off('click', '#save')
      .on('click', '#save', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var razor = {
          razorName: $('#razorName').val(),
          notes: $('#notes').val(),
          date: $('#date').val(),
          picture: $('#picture').val(),
          rating: $('#rating').val(),
          uses: $('#uses').val(),          
          uid: uid
        }
        var response = saveRazor(razor).then(function(){
          redirect('razors/list');
        });
      })
      .on('click', '#delete', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var razor = null;
        var response = saveRazor(razor).then(function(){
          redirect('razors/list');
        });
      })      
  }
}