import dialogPolyfill from 'dialog-polyfill';
import API from '../api-client.js';
import Toast from '../utils/toast.js';
import Alert from '../utils/alert.js';

/*
 * Handles "Add Subscription" behavior
 *
 * Dispatches 'subscribed' to `document` when a new subscription is made
 */
export default (function(){
  "use strict";

  let dialog = null;
  let url;
  let events = {
    subscribed: 'feed-subscribed',
  };

  let subscribe = () => {
    API.then((api)=>{
      api.subscribe(url.value).then((site)=>{
        document.dispatchEvent(new Event(events.subscribed));
        Toast(`Subscribed to ${url.value}`);
        dialog.close();
      }).catch((error)=>{
        error.json().then((json)=>{
          Alert({
            title: "Error",
            message: json.feed_url[0]
          }).then(()=>{
            url.focus();
          });
        });
      });
    })
  }

  /* 
   * Returns a promise that is resolved as soon as everything is initialized
   */
  let init = (opts)=>{
    return new Promise((resolve, reject)=>{
      if(!opts || !opts.triggerSelector){
        reject('opts.triggerSelector is required');
        return;
      }

      dialog = document.querySelector("#add-subscription.mdl-dialog");
      if(!dialog.showModal){
        dialogPolyfill.registerDialog(dialog);
      }
      url = dialog.querySelector('#add-subscription-field');

      dialog.querySelector('button.cancel').addEventListener('click', ()=>{
        dialog.close();
        url.value = '';
      });

      dialog.querySelector('button.subscribe').addEventListener('click', subscribe);

      document.querySelector(opts.triggerSelector).addEventListener('click', (event)=>{
        dialog.showModal();
      });

      resolve();
    });
  }

  return {
    init,
    events,
  }

  
})();
