var config = {
      apiKey: "AIzaSyBKQQFa_fUW-2SUww7zX019idRrO2AWYTI",
      databaseURL: "https://razor-reviews.firebaseio.com",
      authDomain: "razor-reviews.firebaseapp.com",
      projectId: "razor-reviews"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location = 'index.html'; 
  } 
});        
