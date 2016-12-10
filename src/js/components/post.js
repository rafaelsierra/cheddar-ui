import API from '../api-client.js';

export default (function(){

  let postsContainer = document.querySelector('.post-list');
  let postTemplate = require('../templates/post-card.hbs');

  let load = ()=>{
    return new Promise((resolve, reject)=>{

      postsContainer.innerHTML = '';
      postsContainer.classList.add('loading');

      API.then((api)=>{
        // Load all posts
        api.loadPosts({'all': true}).then((posts)=>{
          let hugeHtml = '';
          postsContainer.classList.remove('loading');
          for(let post of posts.results){
            // Creates a card for each post and adds it to the page
            hugeHtml += postTemplate({post: post});
          }
          postsContainer.innerHTML = hugeHtml;
        });
      });
    });
  }
  return {
    load,
  };

})()
