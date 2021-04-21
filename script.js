jQuery(document).ready(function() {
  $('#response').html('<p>Hello</p>'); 
  
  $("").submit(function(event) {
      event.preventDefault();
    
      var $form = $(this),
      url = "";

      var posting = $.post(url, {
        inputPrompt: "",
        responseList: "",
        options: {}
      });

      posting.done(function(data) {
        $('#result').text('failed');
      });

      posting.fail(function(data) {
        $('#result').text('failed');
      });
		});
});
