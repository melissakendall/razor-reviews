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

	hydrateReviews();

	$("#saveReview").click(function() {
		var id = $(this).val();

		if(id) {
			db.collection("reviews").doc(id).set({
			    name: $("#mealName").val(),
			    rating: $("#rating").val(),
			    notes: $("#notes").val()
			})
			.then(function() {
			    console.log("Document successfully written!");
			})
			.catch(function(error) {
			    console.error("Error writing document: ", error);
			});
		}
		else {
			db.collection("reviews").doc().set({
			    name: $("#mealName").val(),
			    rating: $("#rating").val(),
			    notes: $("#notes").val()
			})
			.then(function() {
			    console.log("Document successfully written!");
			})
			.catch(function(error) {
			    console.error("Error writing document: ", error);
			});			
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
}

function populate(obj) {

	$('.list-group-item').removeClass('active');
	$(obj).addClass('active');

	var review = db.collection("reviews").doc(obj.id).get().then(function(doc) {

		var review = doc.data();

		$("#mealName").val(review.name);
		$("#rating").val(review.rating);
		$("#notes").val(review.notes);
		$("#saveReview").val(obj.id)
	});
}

function hydrateReviews() {
	$("#reviewList").empty();
	
	db.collection("reviews").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {

			var stars = "";

			//for(var i = 1; i < doc.data().rating; i++) {
			//	stars += "<i class='fa fa-star star-rating' aria-hidden='true'></i>";
			//}

			$("#reviewList").append( $("<li>", { class:'list-group-item meal', id: doc.id, text: doc.data().name, onClick: 'populate(this)' }) );

		});
	});
}