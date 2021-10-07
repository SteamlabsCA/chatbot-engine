function appendMessage(inputPrompt) {
	var time = new Date().getTime();
	var date = new Date(time);
	// If there's no previouse chat response create the container
	if (!$('.chat_response').length) {
		$('#response').append("<ul class='chat_response'></ul>");
	}

	// Append User's reponse
	let $user_response =
		"<li class='input_message'><span class='content_container'><p class='user_p'>" +
		inputPrompt +
		"</p><span class='name_date'><p class='bold_p'>You </p><p class='p_time'>" +
		date.toLocaleTimeString() +
		"</p></span></span><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fperson.png?v=1622144125311' class='user_profile'></img></li>";
	$('.chat_response').append($user_response);

	// Bot is typing Response
	let $bot_response =
		"<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fbot.png?v=1622144125211' class='bot_profile'></img><span class='content_container'><p class='bot_p loading'></p><span class='tooltiptext init-hide'></span><span class='name_date'><p class='bold_p'>Bot </p><p class='p_time'>" +
		date.toLocaleTimeString() +
		'</p></span></span></li>';
	$('.chat_response').append($bot_response);

	// Append Automated Bot Response
	//let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>Hello, the current date is: "+date+"</p></span></li>";
	//$(".chat_response").append($bot_response);

	document.getElementById('response').scrollTop = document.getElementById('response').scrollHeight;
}
