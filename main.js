/* globals responseList */
jQuery(document).ready(function(){
  $("#start").click(function() {
    responseList("wR5uUCYIL21JQxPAAJAL14VVFh62YbHD4Kjdn7om");
    $("#start_container").fadeOut("fast",function(){
      $(".activity").fadeIn("fast");
    });
  });
});