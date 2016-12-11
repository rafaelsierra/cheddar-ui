import API from '../api-client.js';

import Handlebars from 'handlebars/dist/handlebars.js';

export default (function(){

  /*
   * Post class used to handle single posts
   */
  class Post {
    constructor(json){
      this.json = json;
      this.parser = new DOMParser();
      this.templates = {
        'default': Handlebars.compile(document.querySelector('#post-card-hbs').textContent),
      }
    }

    get getTemplate(){
      return this.templates['default'];
    }

    render(){
      return this.parser.parseFromString(this.getTemplate({post: this.json}), "text/html").body.firstElementChild;
    }
  }

  let postsContainer = document.querySelector('.post-list');
  let postCounterBadge = (value)=>{ document.querySelector('.post-counter-badge').dataset['badge']=value; }

  let load = ()=>{
    return new Promise((resolve, reject)=>{

      postsContainer.innerHTML = '';
      postsContainer.classList.add('loading');

      API.then((api)=>{
        // Load all posts
        api.loadPosts({'all': true}).then((posts)=>{
          postCounterBadge(posts.count);
          postsContainer.classList.remove('loading');

          for(let post_json of posts.results){
            // Creates a card for each post and adds it to the page
            postsContainer.appendChild((new Post(post_json)).render());
          }
        });
      });
    });
  }
  return {
    load,
  };

})()
