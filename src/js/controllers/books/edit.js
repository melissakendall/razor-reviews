var $ = require('jquery');
var firebase = require('firebase');

module.exports = function(Auth, redirect) {
  return function (params) {
    // Get a reference to the database service
    var database = firebase.database();
    var uid = firebase.auth().currentUser.uid;
    var query = firebase.database().ref("user-books/" + uid + "/" + params.id);

    //Fire Query
    query.once("value").then(fillData)

    //Fill The data
    function fillData(snap) {
      var data = snap.val();
      $('#bookName').val(data.bookName);
      $('#notes').val(data.notes);
      $('#isbn').val(data.isbn);
      $('#date').val(data.date);
      $('#picture').val(data.picture);
      $('#picture-display').attr('src', data.picture);
      $('#rating').val(data.rating);
    }

    //Save function
    function saveBook(book) {
      var uid = firebase.auth().currentUser.uid;
      var postKey = params.id;
      var updates = {};
      updates['/user-books/' + uid + '/' + postKey] = book;

      return database.ref().update(updates);
    }

    $(document)
      .off('click', '#save')
      .on('click', '#save', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var book = {
          bookName: $('#bookName').val(),
          notes: $('#notes').val(),
          isbn: $('#isbn').val(),
          date: $('#date').val(),
          picture: $('#picture').val(),
          rating: $('#rating').val(),
          uid: uid
        }
        var response = saveBook(book).then(function(){
          redirect('books/list');
        });
      })
      .on('click', '#delete', function(e) {
        var uid = firebase.auth().currentUser.uid;
        var book = null;
        var response = saveBook(book).then(function(){
          redirect('books/list');
        });
      })      
  }
}