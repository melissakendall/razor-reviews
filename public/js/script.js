var config = {
  apiKey: "AIzaSyBKQQFa_fUW-2SUww7zX019idRrO2AWYTI",
  authDomain: "razor-reviews.firebaseapp.com",
  databaseURL: "https://razor-reviews.firebaseio.com",
  projectId: "razor-reviews",
  storageBucket: "razor-reviews.appspot.com"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location = 'index.html'; 
  } 
});        

var db = firebase.firestore();

$(document).ready(function() {

	$("#selectSet").change(function() {
		clearFields();
		hydrateReviews();
	});

	$("#saveReview").click(function() {
		var id = $(this).val();
		var selectedSet = $("#selectSet").val();

		if(id) {
			//Edit
			db.collection(selectedSet).doc(id).set({
			    name: $("#mealName").val(),
			    rating: $("#rating").val(),
			    notes: $("#notes").val()
			});
		}
		else {
			//Save
			db.collection(selectedSet).doc().set({
			    name: $("#mealName").val(),
			    rating: $("#rating").val(),
			    notes: $("#notes").val()
			});		

			clearFields();	
		}

		hydrateReviews();		
	});

	$("#deleteReview").click(function() {
		var id = $(this).val();
		var selectedSet = $("#selectSet").val();

		if(id) {
			db.collection(selectedSet).doc(id).delete();
		}

		clearFields();
		hydrateReviews();
	});

	$("#clearReview").click(function() {
		clearFields();
	});	
});

function clearFields() {
	$("#mealName").val("");
	$("#rating").val("");
	$("#notes").val("");
	$("#saveReview").val("");	
	$("#deleteReview").val("");
	$('.list-group-item').removeClass('active');
	$('#deleteReview').prop('disabled', true);
}

function populate(obj) {

	$('.list-group-item').removeClass('active');
	$(obj).addClass('active');

	var selectedSet = $("#selectSet").val();

	var review = db.collection(selectedSet).doc(obj.id).get().then(function(doc) {

		var review = doc.data();

		$("#mealName").val(review.name);
		$("#rating").val(review.rating);
		$("#notes").val(review.notes);
		$("#saveReview").val(obj.id);
		$("#deleteReview").val(obj.id);
		$('#deleteReview').prop('disabled', false);
	});
}

function hydrateReviews() {
	$("#reviewList").empty();

	var selectedSet = $("#selectSet").val();
	
	db.collection(selectedSet).get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {

			$("#reviewList").append( $("<li>", { class:'list-group-item meal', id: doc.id, text: doc.data().name + " (" + doc.data().rating + ") ", onClick: 'populate(this)' }) );
		});
	});
}