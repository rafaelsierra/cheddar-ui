(function(window, document){
    /*
     * This script handles DOM interaction
     */
    let loginBox = document.getElementById('login');
    let loginForm = loginBox.querySelector('form');
    loginForm.addEventListener('submit', function(event){
        event.preventDefault();
        API.then(function(api){
            let elements = loginForm.elements;
            api.login(
                elements.namedItem('email').value, 
                elements.namedItem('password').value
            ).then(function(json){
                console.log(json);
            }).catch(function(error){
                console.log(error);
            });
        });
    });

    function applyBodyClasses(){
        API.then(function(api){
            api.isAuthenticated().then(function(isAuthenticated){
                if(isAuthenticated){
                    document.body.classList.add('authenticated');
                }else{
                    document.body.classList.add('anonymous');
                }
            });
        });
    }
    applyBodyClasses();
    
})(window, document)
