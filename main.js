/* globals responseList */

jQuery(document).ready(function(){
  // Change these files to change the response list text from the assets
  $("#start").click(function() {
    responseList();
    $("start_container").fadeOut("fast",function(){
      
    });
  });
});