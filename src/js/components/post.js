import API from '../api-client.js';

import Handlebars from 'handlebars/dist/handlebars.js';

export default (function(){

  /*
   * Post class used to handle single posts
   */
  class Post {
    constructor(json){
      this.json = json;
      this.json.content = this.json.content || "";
      this.parser = new DOMParser();

      this.contentAsDOM = this.parser.parseFromString(this.json.content, "text/html").body;
      this.templates = {
        'default': Handlebars.compile(document.querySelector('#post-card-default-hbs').textContent),
        'small-with-image': Handlebars.compile(document.querySelector('#post-card-small-with-image-hbs').textContent),
        'no-content': Handlebars.compile(document.querySelector('#post-card-no-content-hbs').textContent),
      }
    }


    get bgImage(){
      if(!this.contentAsDOM){
        return null;
      }
      let imgs = this.contentAsDOM.querySelectorAll('img');
      switch(imgs.length){
        case 0:
          return null;
        case 1:
          return imgs[0];
        default:
          return (()=>{
            // Returns the biggest image
            let biggestArea = 0;
            let biggestImg = null;
            for(let img of imgs){
              if(img.width > 0 && img.height > 0){
                let area = img.width * img.height;
                if(area > biggestArea){
                  biggestImg = img;
                }
              }
            }
            return biggestImg || imgs[0];
          })();
      }
    }

    isSmall() {
      if(!this.contentAsDOM){ return 0; }
      return this.contentAsDOM.textContent.length < 280; // About 2 tweets long is small
    }

    get getTemplate(){
      let bgImage = this.bgImage;
      if(bgImage){
        this.json.backgroundImage = bgImage.src;
      }

      if(this.isSmall()){
        if(bgImage){
          return this.templates['small-with-image'];
        }else{
          return this.templates['no-content'];
        }
      }
      return this.templates['default'];
    }

    render(){
      let dom = this.parser.parseFromString(this.getTemplate({post: this.json}), "text/html").body.firstElementChild;
      // Makes every link open in another tab
      for(let a of dom.querySelectorAll("a")){
        a.target = "_blank";
      }
      return dom;
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
