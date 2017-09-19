var $ = require('jquery');
var Auth = require('./auth')
var Router = require('./router');
var firebase = require('firebase');

//Redirect to some Page or URL
var redirect = function(to) {
  appRouter.go(to)
}

var appRouter = new Router({
  mountPoint: '#root',
  indexRoute: 'selectCategory',
  routes: {  
    login : {
      path: 'login',
      templateUrl: 'partials/login.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( !user && window.location.hash.match('/login') ){
          return true;
        } else {
          return 'selectCategory';
        }
      },
      controller: require('./controllers/login')(Auth, redirect)
    },
    selectCategory : {
      path: 'selectCategory',
      templateUrl: 'partials/selectCategory.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/selectCategory')(Auth, redirect)
    },
    listMeals : {
      path: 'meals/list',
      templateUrl: 'partials/meals/list.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },      
      controller: require('./controllers/meals/list')(Auth, redirect)
    }, 
    addMeal : {
      path: 'meals/add',
      templateUrl: 'partials/meals/add.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/meals/add')(Auth, redirect)
    },    
    editMeal : {
      path: 'meals/:id/edit',
      templateUrl: 'partials/meals/edit.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/meals/edit')(Auth, redirect)
    },
    listRazors: {
      path: 'razors/list',
      templateUrl: 'partials/razors/list.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },      
      controller: require('./controllers/razors/list')(Auth, redirect)
    },    
    addRazor : {
      path: 'razors/add',
      templateUrl: 'partials/razors/add.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/razors/add')(Auth, redirect)
    },    
    editRazor : {
      path: 'razors/:id/edit',
      templateUrl: 'partials/razors/edit.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/razors/edit')(Auth, redirect)
    },

    listBooks: {
      path: 'books/list',
      templateUrl: 'partials/books/list.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },      
      controller: require('./controllers/books/list')(Auth, redirect)
    },    
    addBooks : {
      path: 'books/add',
      templateUrl: 'partials/books/add.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/books/add')(Auth, redirect)
    },    
    editBooks : {
      path: 'books/:id/edit',
      templateUrl: 'partials/books/edit.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/books/edit')(Auth, redirect)
    },
    listGames: {
      path: 'games/list',
      templateUrl: 'partials/games/list.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },      
      controller: require('./controllers/games/list')(Auth, redirect)
    },    
    addGames : {
      path: 'games/add',
      templateUrl: 'partials/games/add.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/games/add')(Auth, redirect)
    },    
    editGames : {
      path: 'games/:id/edit',
      templateUrl: 'partials/games/edit.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/games/edit')(Auth, redirect)
    }    
  }
})

//Error box indexes
var errorIndex = 0;
var IMGUR_API_KEY = '';

$(document).ready(function() {

  //Initialize the Firebase App
  Auth.init(function() {

    var user = Auth.checkLoggedInUser();

    if(user) {
      
      //Detect imgur redirect and store cookie
      var imgurToken = getParameterByName("access_token");
      if(imgurToken) {
        setCookie("imgurToken", imgurToken, 30);
        window.location.href = window.location.origin;   
      }

      //No imgur cookie stored? offer this option
      if(!getCookie("imgurToken")) {
        
        //Still insecure, but better then hardcoding!
        var query = firebase.database().ref('secrets/4c149f04-c381-457');
        query.once("value").then(function(snap) {
          var data = snap.val();
          IMGUR_API_KEY = data.secret;

          //Add HREF and show Imgur Link
          $('#imgurLink').attr('href', 'https://api.imgur.com/oauth2/authorize?client_id=' + IMGUR_API_KEY + '&response_type=token');
          $('#imgurLink').show();

        });
      }

    }

    //Logout Button
    $(document).on('click', '.logout-link', function (e) {
      
      //Logout, switch displays
      Auth.logout();

      $('.login-link').css('display', 'block');
      $('.logout-link').hide();

      redirectToLogin(); 
    });

    if( user ){
      $('.logout-link').css('display', 'block');
      $('.login-link').hide();
    } else {
      $('.login-link').css('display', 'block');
      $('.logout-link').hide();
    }

    appRouter.listen();
  }); 
})