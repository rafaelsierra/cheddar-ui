import Toast from './utils/toast.js';
import Alert from './utils/alert.js';
import API from './api-client.js';
import Site from './components/site.js';

/*
 * Webpack stuff
 */
require('material-design-lite');
require('material-design-lite/dist/material.amber-blue.min.css');

require('./mdl-helper/layout.js'); // This is just a patch for Material Layout
require('../css/cheddar.less');
/*
 * End webpack
 */

window.addEventListener('load', function(){
  /*
   * Apply body classes based on current app state
   */
  function updateAppState(){
    return new Promise(function(resolve, reject){
      API.then(function(api){
        api.isAuthenticated().then(function(isAuthenticated){
          if(isAuthenticated){
            Site.updateDrawer();
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
   * Updates the login and register form to set fields as required if they are in focus
   */
  function setFormValidation(form){
    let elements = form.querySelectorAll('input, button')
    for(let element of elements){
      ['focus', 'click'].forEach(e => element.addEventListener(e, function(){
        for(let field of elements){
          field.required = true;
        }
      }));

      element.addEventListener('blur', function(){
        for(let field of elements){
          field.required = false;
        }
      });
    }
  }
  setFormValidation(loginForm);
  setFormValidation(registerForm);

  /*
   * Menu logout click
   */
  logoutLink.addEventListener('click', function(event){
    API.then(function(api){
      return api.logout();
    }).then(function(){
      updateAppState();
      Layout.closeDrawer();
      Toast('Bye!');
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
          updateAppState();
          Toast(`Welcome, ${name}!`);
          loginForm.reset();
        });
      }).catch(function(error){
        Alert({
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
      Alert({
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
        updateAppState();
        registerForm.reset();
      }).catch(function(response){
        if(response.non_field_errors){
          Alert({
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
  updateAppState();

})
