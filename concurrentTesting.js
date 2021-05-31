let test = false;
let ajaxCalls = [];
let url = "https://57sunxdj45.execute-api.us-west-2.amazonaws.com/dev/convert";
let data = {
          inputPrompt: "Hello",
          responseList: ["I like pie","Roasted goat is nice but takes a long time to {cook}","a fresh fruit bowl sounds {nice}"],
          language: "EN"
        };
jQuery(document).ready(function() {
  
  $("#start").click(function() {
    if (test) {
      for(let i = 0; i < 11; ++i){
        ajaxCalls.push(  $.ajax({
                          url: url,
                          type: "POST",
                          contentType: "application/json",
                          data: JSON.stringify(data),
                          beforeSend: function(xhr) {
                            xhr.setRequestHeader("x-api-key", "wR5uUCYIL21JQxPAAJAL14VVFh62YbHD4Kjdn7om"); 
                          }
                      }));
      }
      
      $.when.apply(undefined, ajaxCalls).then(...)
    }
  });
});