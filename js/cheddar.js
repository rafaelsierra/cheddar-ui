(function(window, document){
    /*
     * This script handles DOM interaction
     *
     */
    let loginBox = document.getElementById('login');
    let loginForm = loginBox.querySelector('form');
    
    let logoutLink = document.querySelector('nav .user .logout');
    let loginLink = document.querySelector('nav .user .login');
    let registerLink = document.querySelector('nav .user .register');
    
    let registerBox = document.getElementById('register');
    let registerForm = registerBox.querySelector('form');

    loginLink.addEventListener('click', function(){
        loginBox.scrollIntoView();
    });
    registerLink.addEventListener('click', function(){
        registerBox.scrollIntoView();
    });

    logoutLink.addEventListener('click', function(event){
        API.then(function(api){
            return api.logout();
        }).then(function(){
            applyBodyClasses();
            Materialize.toast('Logged out', 2000);
        });
    });

    loginForm.addEventListener('submit', function(event){
        event.preventDefault();
        API.then(function(api){
            let elements = loginForm.elements;
            api.login(
                elements.namedItem('username').value, 
                elements.namedItem('password').value
            ).then(function(json){
                console.log(json);
                applyBodyClasses();
                Materialize.toast('Logged in', 2000);
            }).catch(function(error){
                console.log(error);
            });
        });
    });

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
    applyBodyClasses();
    
})(window, document)
