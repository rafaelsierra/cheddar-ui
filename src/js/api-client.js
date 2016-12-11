import storage from './storage';

export default (function(){
  // Cheddar API root URL
  let apiRootUrl = API_ROOT_URL;

  // Token being used
  let token = storage.get('token');

  // User account
  let account = null;

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
    opts.headers = opts.headers || {};

    if(token){
      opts.headers['Authorization'] = 'Token '+token;
    }

    if(!opts.headers['Content-Type']){
      opts.headers['Content-Type'] = 'application/json';
    }
    opts.mode = 'cors';

    return new Promise(function(resolve, reject){
      fetch(url, opts).then(function(response){
        if(response.ok){
          if(response.status == 204){
            resolve();
          }else{
            response.json().then(function(json){resolve(json)});
          }
        }else{
          reject(response);
        }
      }).catch(function(error){
        reject(error);
      });
    });
  }

  /*
   * Given a username and password, tries to login into API.
   * Returns a promise
   */
  function login(username, password){
    return new Promise(function(resolve, reject){
      Request(apiTree['obtain-auth-token'], {
        method: 'POST',
        body: JSON.stringify({'username': username, 'password': password})
      }).then(function(json){
        token = json.token;
        storage.set('token', token);
        resolve();
      }).catch(function(response){
        reject(response);
      });
    })
  }

  /*
   * Returns the user account
   */
  function getAccount(){
    return new Promise(function(resolve, reject){
      if(!account){
        Request(apiTree['account']).then(function(json){
          account = json;
          resolve(json);
        }).catch(function(response){
          reject(response);
        });
      }else{
        resolve(account);
      }
    });
  }
  /*
   * Logs the user out by deleting the token and removing it from storage
   */
  function logout(){
    return new Promise(function(resolve, reject){
      Request(apiTree['obtain-auth-token'], {
        method: 'DELETE'
      }).then(function(){
        storage.remove('token')
        token = null;
        account = null;
        resolve();
      })
    });
  }

  function register(username, email, password){
    return new Promise(function(resolve, reject){
      Request(apiTree['account'], {
        method: 'POST',
        body: JSON.stringify({
          'username': username,
          'email': email,
          'password': password
        })
      }).catch(function(response){
        reject(response);
      }).then(function(json){
        return login(username, password);
      }).then(function(){
        resolve();
      });
    });
  }

  /*
   * Returns a promise telling if the user is already logged in
   */
  function isAuthenticated(){
    return new Promise(function(resolve, reject){
      Request(apiTree['account']).then(function(response){
        resolve(true);
      }).catch(function(){
        resolve(false);
      })
    });
  }

  /*
   * Returns all subscribed sites
   */
  function getSites(){
    return new Promise(function(resolve, reject){
      let siteList = [];
      let doRequest = (url) => {
        Request(url).then(function(json){
          siteList = siteList.concat(json.results);
          // Recursively fetches all sites
          if(json.next){
            doRequest(json.next);
          }else{
            resolve(siteList);
          }
        }).catch(function(error){
          reject(error);
        });
      }
      doRequest(apiTree['feeds/sites']);
    });
  }

  /*
   * Subscribe to a feed
   *
   * Returns a promise
   */
  function subscribe(feed_url){
    return new Promise(function(resolve, reject){
      Request(apiTree['feeds/sites'], {
        method: 'POST',
        body: JSON.stringify({'feed_url': feed_url})
      }).then(function(json){
        resolve(json);
      }).catch(function(error){
        reject(error);
      });
    });
  }

  /*
   * Load posts from the API based on the filter
   * Available filters are:
   *   - all(bool): no filters applied
   */
  function loadPosts(filter){
    return new Promise(function(resolve, reject){
      let url = '';
      let opts = {};
      if(filter.all){
        url = apiTree['feeds/posts'];
      }

      if(!filter.order){
        filter.order = 'desc';
      }else if(filter.order != 'asc' && filter.order != 'desc'){
        filter.order = 'desc';
      }

      url = new URL(url);
      url.searchParams.append('order', filter.order);

      Request(url, opts).then(function(json){
        resolve(json);
      }).catch(function(response){
        reject(response);
      });

    })
  }

  return new Promise(function(resolve, reject){
    let api = {
      getAccount,
      getSites,
      isAuthenticated,
      loadPosts,
      login,
      logout,
      register,
      subscribe,
    }
    if(!apiTree['account']){
      // Means the API wasn't initialized yet
      Request(apiRootUrl).then(function(response){
        Object.keys(response).forEach(function(key){
          apiTree[key] = response[key];
        });
        resolve(api);
      }).catch(function(response){
        reject(response);
      });
    }else{
      // API is already initialized
      resolve(api);
    }
  });

})();
