(function(window, document){
    // Cheddar API root URL
    let apiRootUrl = 'http://localhost:8000/v1/';

    // Token being used
    let token = storage.get('token');

    let apiTree = {};

    /*
     * Returns a promise ready XHR object
     * @url
     * @opts.method
     * @opts.headers ({'Header': 'Value'})
     */
    function Request(url, opts){
        opts = opts || {};
        // Initialize headers
        opts.headers = opts.headers || new Headers();

        if(token){
            opts.headers.set('Authorization', 'Token '+token);
        }

        if(!opts.headers.has('Content-Type')){
            opts.headers.set('Content-Type', 'application/json');
        }

        opts.mode = 'cors';

        return new Promise(function(resolve, reject){
            fetch(url, opts).then(function(response){
                if(response.ok){
                    response.json().then(function(json){resolve(json)});
                }else{
                    reject(response);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    }

    /*
     * Given a email and password, tries to login into API.
     * Returns a promise
     */
    function login(email, password){
        return new Promise(function(resolve, reject){
            Request(apiTree.account, {
                method: 'POST',
                body: JSON.stringify({'email': email, 'password': password})
            }).then(function(json){
                resolve(json);
            }).catch(function(response){
                reject(response);
            });
        })
    }

    /*
     * Returns a promise telling if the user is already logged in
     */
    function isAuthenticated(){
        return new Promise(function(resolve, reject){
            Request(apiTree.account).then(function(response){
                resolve(true);
            }).catch(function(){
                resolve(false);
            })
        });
    }

    window.API = new Promise(function(resolve, reject){
        let api = {
            'login': login,
            'isAuthenticated': isAuthenticated,
        }
        if(!apiTree.account){
            // Means the API wasn't initialized yet
            Request(apiRootUrl).then(function(response){
                Object.keys(response).forEach(function(key){
                    apiTree[key] = response[key];
                });
                resolve(api);
            });
        }else{
            // API is already initialized
            resolve(api);
        }
    });

})(window, document);
