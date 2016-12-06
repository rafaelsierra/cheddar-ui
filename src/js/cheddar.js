
import API from './api-client';

/*
 * Webpack stuff
 */
require('material-design-lite');
require('material-design-lite/dist/material.amber-blue.min.css');
require('./mdl-helper/layout.js');
require('../css/cheddar.less');
/*
 * End webpack
 */

window.addEventListener('load', function(){
  /*
   * Display the alert modal
   * Returns a promise that resolves when the modal is closed
   */
  function alert(opts){
    return new Promise(function(resolve, reject){
      console.log(opts);
      if(!opts){ opts = "";}
      if(typeof opts === "string"){
        opts = {message: opts};
      }
      if(!opts.title){
        opts.title = "Alert";
      }
      let alertModal = document.getElementById("alert-modal");
      alertModal.querySelector(".modal-content h2").textContent = opts.title;
      alertModal.querySelector(".modal-content p").textContent = opts.message;
      $(alertModal).modal({
        dismissible: false,
        complete: function(){resolve();}
      }).modal('open')
    });
  }

  /*
   * Apply body classes based on current app state
   */
  function applyBodyClasses(){
    return new Promise(function(resolve, reject){
      API.then(function(api){
        api.isAuthenticated().then(function(isAuthenticated){
          if(isAuthenticated){
            document.body.classList.add('authenticated');
            document.body.classList.remove('anonymous');
          }else{
            document.body.classList.add('anonymous');
            document.body.classList.remove('authenticated');
          }
          resolve();
        });
      });
    });
  }

  /*
   * This script handles DOM interaction
   *
   */
  let loginBox = document.getElementById('login');
  let loginForm = loginBox.querySelector('form');

  let logoutLink = document.querySelector('.mdl-layout__drawer nav .logout');

  let registerBox = document.getElementById('register');
  let registerForm = registerBox.querySelector('form');
  
  /*
   * Material Design stuff
   */
  let Layout = document.querySelector('.mdl-layout').MaterialLayout;

  /*
   * Menu logout click
   */
  logoutLink.addEventListener('click', function(event){
    API.then(function(api){
      return api.logout();
    }).then(function(){
      applyBodyClasses();
      Materialize.toast('Bye!', 1000);
    });
  });

  /*
   * Login form submit
   */
  loginForm.addEventListener('submit', function(event){
    event.preventDefault();
    API.then(function(api){
      let elements = loginForm.elements;
      api.login(
        elements.namedItem('username').value,
        elements.namedItem('password').value
      ).then(function(){
        // After logging in, display the welcome toast with user name
        api.getAccount().then(function(account){
          let name = account.first_name?account.first_name:account.username;
          applyBodyClasses();
          Materialize.toast(`Welcome, ${name}!`, 1000);
        });
      }).catch(function(error){
        alert({
          title: "Nops!",
          message: "Your username or password are not correct"
        }).then(function(){
          loginForm.querySelector("#username").focus();
        });
      });
    });
  });

  /*
   * Register form submit
   */
  registerForm.addEventListener('submit', function(event){
    event.preventDefault();
    let password = registerForm.querySelector("#reg-password");
    let password2 = registerForm.querySelector("#reg-password2");

    if(password.value != password2.value){
      password.classList.add('invalid')
      password2.classList.add('invalid')
      alert({
        title: "Error",
        message: "Passwords are not equal"
      }).then(function(){
        password.focus();
      });
      return;
    }
     
    API.then(function(api){
      api.register(
        registerForm.querySelector("#reg-username").value,
        registerForm.querySelector("#reg-email").value,
        password.value,
      ).then(function(){
        applyBodyClasses();
      }).catch(function(response){
        if(response.non_field_errors){
          alert({
            title: "Warning",
            message: response.non_field_errors
          });
        }
      })
    });

  });

  /*
   * First things firts
   */
  applyBodyClasses();

})
