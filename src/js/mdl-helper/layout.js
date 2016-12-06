/*
 * Adds new helper to MDL
 */
(function(){
  'use strict';

  /*
   * Opens the drawer when it is closed or does nothing otherwise
   */
  MaterialLayout.prototype.openDrawer = function(){
    if (!this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.toggleDrawer();
    }
  }  
  MaterialLayout.prototype['openDrawer'] = MaterialLayout.prototype.openDrawer;

  /*
   * Closes the drawer when it is open or does nothing otherwise
   */
  MaterialLayout.prototype.closeDrawer = function(){
    if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.toggleDrawer();
    }
  }  
  MaterialLayout.prototype['closeDrawer'] = MaterialLayout.prototype.closeDrawer;

})();
