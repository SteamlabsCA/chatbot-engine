/* globals responseList */

// Insert teacher API key here
let teacherKey = "wR5uUCYIL21JQxPAAJAL14VVFh62YbHD4Kjdn7om";

jQuery(document).ready(function() {
  $("#start").click(function() {
    if (teacherKey.length > 0 && !test) {
      responseList(teacherKey);
      $("#start_container").fadeOut("fast", function() {
        $(".activity").fadeIn("fast");
      });
    } else {
      alert("Missing Teacher API key");
    }
  });
});
