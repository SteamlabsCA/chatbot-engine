let test = true;
let testNumber = 5;

let ajaxCalls = [];
let url = "https://2ehix0nexk.execute-api.us-west-2.amazonaws.com/dev/convert";
let data = {
  inputPrompt: "Hello",
  responseList: [
    "I like pie",
    "Roasted goat is nice but takes a long time to {cook}",
    "a fresh fruit bowl sounds {nice}"
  ],
  language: "EN"
};
jQuery(document).ready(function() {
  $("#start").click(function() {
    alert("test starting");
    if (test) {
      for (let i = 0; i < testNumber; ++i) {
        ajaxCalls.push(
          $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
              xhr.setRequestHeader(
                "x-api-key",
                "wR5uUCYIL21JQxPAAJAL14VVFh62YbHD4Kjdn7om"
              );
            },
            success: function() {
              console.log(i + " succeeded");
            },
            error: function(err) {
              console.log(err);
            }
          })
        );
      }
      $.when.apply(undefined, ajaxCalls).then(function(results) {
        console.log("done");
      });
    } else {
      alert("failed");
    }
  });
});
