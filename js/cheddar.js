(function(window, document){
    /*
     * This script handles DOM interaction
     *
     */
    let loginBox = document.getElementById('login');
    let loginForm = loginBox.querySelector('form');
    
    let logoutLink = document.getElementById('logout');
    
    let registerBox = document.getElementById('register');
    let registerForm = registerBox.querySelector('form');

    logoutLink.addEventListener('click', function(event){
        API.then(function(api){
            return api.logout();
        }).then(function(){
            applyBodyClasses();
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
