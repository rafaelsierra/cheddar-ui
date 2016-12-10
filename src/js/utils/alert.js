import dialogPolyfill from 'dialog-polyfill';
/*
 * Display the alert modal
 * Returns a promise that resolves when the modal is closed
 */
export default (function(){
  "use strict";
  
  let dialog = document.querySelector('#alert.mdl-dialog');
  if(!dialog.showModal){
    dialogPolyfill.registerDialog(dialog);
  }

  return function(opts){
    return new Promise(function(resolve, reject){

      if(!opts){ opts = "";}
      if(typeof opts === "string"){
        opts = {message: opts};
      }
      if(!opts.title){
        opts.title = "Alert";
      }

      dialog.querySelector('.mdl-dialog__title').textContent = opts.title;
      dialog.querySelector('.mdl-dialog__content p').textContent = opts.message;

      let closeButton = dialog.querySelector('.mdl-dialog__actions button');
      let closeModal = ()=>{
        dialog.close();
        closeButton.removeEventListener('click', closeModal);
        resolve();
      }
      closeButton.addEventListener('click', closeModal);
      dialog.showModal();

    });
  }
})();


