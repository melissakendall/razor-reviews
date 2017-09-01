var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function (params) {
    // Get a reference to the database service
    var database = firebase.database();
    var uid = firebase.auth().currentUser.uid;
    var query = firebase.database().ref("user-games/" + uid + "/" + params.id);

    //Fire Query
    query.once("value").then(fillData)

    //Fill The data
    function fillData(snap) {
      var data = snap.val();
      $('#gameName').val(data.gameName);
      $('#notes').val(data.notes);
      $('#serial').val(data.serial);
      $('#console').val(data.console);      
      $('#date').val(data.date);
      $('#picture').val(data.picture);
      $('#picture-display').attr('src', data.picture);
      $('#rating').val(data.rating);
    }

    //Save function
    function saveGame(game) {
      var uid = firebase.auth().currentUser.uid;
      var postKey = params.id;
      var updates = {};
      updates['/user-games/' + uid + '/' + postKey] = game;

      return database.ref().update(updates);
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
      })
      .on('click', '#delete', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var game = null;
        var response = saveGame(game).then(function(){
          redirect('games/list');
        });
      })      
  }
}