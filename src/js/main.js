//VARIABLES
var FIREBASE_URL = 'https://authorize-demo.firebaseio.com';
var fb = new Firebase('https://authorize-demo.firebaseio.com');
var onLoggedOut = $('.onLoggedOut');
var onLoggedIn = $('.onLoggedIn');

var loginPage = $('.login');
var loginForm = $('.login form');

var registerPage = $('.register');

//Switching forms
$('.toLoginBtn, .toRegisterBtn').click(toggleLoginRegister);

//Logout
$('.doLogout').click(function () {
  fb.unauth();
  toggleContentBasedOnLogin();
})

//Login verification
loginForm.submit(function () {
  var email = $('input[type="email"]');
  var password = $('input[type="password"]');

  fb.authWithPassword({
    email: email.val(),
    password: password.val()
  }, function (err, authData) {
    if (err) {
      alert(err.toString());
    } else {
      toggleContentBasedOnLogin();
      var h1 = $('.onLoggedIn h1').text('Hello ' + authData.password.email)
      email.val('');
      password.val('');
      $.ajax({
        method: 'PUT',
        url: FIREBASE_URL + '/users/' + authData.uid + '/profile.json',
        data: JSON.stringify(authData),
       }).done(function() {
        console.log('This also works!') //can get rid of this callback
      });
    }
  });
  event.preventDefault();
});

//REGISTRATION PROCESS
$('.register form').submit(function () {
  var email = $('.register input[type="email"]');
  var passwords = $('.register input[type="password"]');
  var password = $(passwords[0]).val();    //each indiv password is regular dom element. You can either wrap the element as jQuery item or do .value.
  var passwordCheck = $(passwords[1]).val();

  if (password === passwordCheck) {
    fb.createUser({
      email: email.val(),
      password: password
    },function (err, userData) {
      if (err) {
        console.log(err.toString());
      } else {
        email.val('');

        toggleLoginRegister();
      }
    });
  } else {
    alert('The passwords do not match');
  }
  event.preventDefault();
});

//Calling the toggle login/logout function
toggleContentBasedOnLogin();

//toggle register and login
function toggleLoginRegister() {
  registerPage.toggleClass('hidden');
  loginPage.toggleClass('hidden');
}

//Toggle login and logout forms
function toggleContentBasedOnLogin() {
  var authData = fb.getAuth();
  if (authData) {
    onLoggedOut.addClass('hidden');
    onLoggedIn.removeClass('hidden');
  } else {
    onLoggedOut.removeClass('hidden');
    onLoggedIn.addClass('hidden');
  }
}


