/*
 * Add moment as helper for Handlebars
 * The very function used as helper is returned as module
 */
import moment from 'moment';
import Handlebars from 'handlebars/dist/handlebars.js';

export default (function(){
  function MomentHelper(date_string, output_format, force_format=false){
    let date = moment(date_string);
    let date_formatted = '';
    if(date.isBefore(moment().subtract(3, 'days')) || force_format === true){
      date_formatted = date.format(output_format);
    }else{
      date_formatted = moment(date_string).fromNow();
    }
    return new Handlebars.SafeString(date_formatted);
    
  }
  Handlebars.registerHelper('moment', MomentHelper);
  return MomentHelper;
})();
