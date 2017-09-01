var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function (params) {
    // Get a reference to the database service
    var database = firebase.database();
    var uid = firebase.auth().currentUser.uid;
    var query = firebase.database().ref("user-meals/" + uid + "/" + params.id);

    //Fire Query
    query.once("value").then(fillData)

    //Fill The data
    function fillData(snap) {
      var data = snap.val();
      $('#mealName').val(data.mealName);
      $('#notes').val(data.notes);
      $('#ate').val(data.ate);
      $('#date').val(data.date);
      $('#picture').val(data.picture);
      $('#picture-display').attr('src', data.picture);
      $('#rating').val(data.rating);
    }

    //Save function
    function saveMeal(meal) {
      var uid = firebase.auth().currentUser.uid;
      var postKey = params.id;
      var updates = {};
      updates['/user-meals/' + uid + '/' + postKey] = meal;

      return database.ref().update(updates);
    }

    $(document)
      .off('click', '#save')
      .on('click', '#save', function(e) {
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
          redirect('meals/list');
        });
      })
      .on('click', '#delete', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var meal = null;
        var response = saveMeal(meal).then(function(){
          redirect('meals/list');
        });
      })      
  }
}