/* globals responseList */

// Insert teacher API key here
let teacherKey = "";

jQuery(document).ready(function() {
  $("#start").click(function() {
    if (teacherKey.length > 0) {
      responseList(teacherKey);
      $("#start_container").fadeOut("fast", function() {
        $(".activity").fadeIn("fast");
      });
    } else {
      alert("Missing Teacher API key");
    }
  });
});
