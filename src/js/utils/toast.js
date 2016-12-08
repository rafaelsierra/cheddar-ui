/*
 * Displays a default toast, no customization.
 */
export default function(message){
  let snackbarContainer = document.querySelector('.mdl-snackbar');
  snackbarContainer.MaterialSnackbar.showSnackbar({message});
}

