(function(window, document){
    window.storage = {
        set: function(key, val){
            return localStorage.setItem(key, JSON.stringify(val));
        },
        get: function(key){
            let val = localStorage.getItem(key);
            return val===null?null:JSON.parse(localStorage.getItem(key));
        },
        remove: function(key){
            let val = localStorage.getItem(key);
            if(val !== null){
                localStorage.removeItem(key);
            }
        }
    }
})(window, document);
