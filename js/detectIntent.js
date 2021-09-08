/* globals teacherKey detectMode language*/

function detectIntent(inputPrompt, intentList) {
	//Load the data to be sent to the API - full script
	let data = {
		inputPrompt: inputPrompt,
		responseList: intentList,
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
			detectMode = true;
			resolve(responseData);
		});
		posting.fail(function (err) {
			console.log(err);
			resolve(false);
		});
	});
}
