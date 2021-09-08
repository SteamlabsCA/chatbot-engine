/* globals teacherKey detectMode language*/

function detectMood(inputPrompt, mood) {
	let moodList = [
		'I feel sad',
		'I feel calm',
		'I feel relaxed',
		'I feel scared',
		'I feel happy',
		'I feel anxious',
		'joyful',
		'I feel anticipating',
		'I feel lively',
		'I feel surprised',
		'I feel dreamy',
		'I feel inspired',
		'I feel gloomy',
		'I feel longing',
		'I feel angry',
		'I feel disappointed',
	];

	//Load the data to be sent to the API - full script
	let data = {
		inputPrompt: inputPrompt,
		responseList: moodList,
		language: language,
		consider: 1,
	};

	return new Promise((resolve, reject) => {
		let url = 'https://2ehix0nexk.execute-api.us-west-2.amazonaws.com/dev/convert';

		var posting = $.ajax({
			url: url,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('x-api-key', teacherKey);
			},
		});

		posting.done(function (responseData) {
			let resMood = responseData.substring(responseData.lastIndexOf(' ') + 1);
			if (resMood === mood.toLowerCase()) {
				detectMode = true;
				resolve(true);
			} else {
				resolve(false);
			}
		});
		posting.fail(function (err) {
			console.log(err);
			resolve(false);
		});
	});
}
