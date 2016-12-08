import API from '../api-client.js';

export default (function(){
  let updateDrawer = ()=>{
    return new Promise((resolve, reject)=>{
      API.then((api)=>{
        api.getSites().then((sites)=>{

          let container = document.querySelector('.mdl-layout__drawer .sites');
          container.innerHTML = '';
          
          for(let site of sites){
            // <a class="mdl-navigation__link">Site name<span class="mdl-badge" data-badge="unread counter"></span></a>
            let a = document.createElement('a');
            let span = document.createElement('span');
            span.classList.add('mdl-badge');
            
            a.textContent = site.title;
            a.dataset['json'] = JSON.stringify(a);
            a.classList.add("mdl-navigation__link");
            a.appendChild(span);
            // TODO: span.dataset['badge'] = site.unread
            container.appendChild(a);
          }
        });
      });
    });
  }
  return {
    updateDrawer,
  };

})()
