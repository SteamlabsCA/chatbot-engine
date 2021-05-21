// for (var index = 0, len = res[id].length; index < len; ++index) {
//       checkList += "<span><input type='checkbox' id='"+id+index+"' name='"+res[id][index]+"' value='"+folder+"'/><label >"+res[id][index]+"</label></span>"
//     }

function responseList(textArray) {
	let responseListArr = [];
	let responseList = [];
	let responseListConcat = '';
	let responseListHash = '';
	var time = new Date().getTime();
	var date = new Date(time);
	let res = [];

	// Attach the checklist to each dropdown
	function attachTexts(id, folder) {
		let checkList = '';
		for (var index = 0, len = res[id].length; index < len; ++index) {
			checkList +=
				"<span><input type='checkbox' id='" +
				id +
				index +
				"' name='" +
				res[id][index] +
				"' value='" +
				folder +
				"'/><label >" +
				res[id][index] +
				'</label></span>';
		}
		return checkList;
	}

	//----Start: Get the lists of text files and concatenate them ----
	//Get All Movie Folders
	$.when
		.apply(
			$,
			textArray.map(function (url) {
				return $.ajax({
					url: 'assets/',
					dataType: 'text',
				});
			})
		)
		.done(function (result) {
			//Store all movie folders split on the newline
			responseListArr = result[0].split('\n');
			responseListArr.pop();

			//Get all text files in the movie folders
			$.when
				.apply(
					$,
					responseListArr.map(function (url) {
						return $.ajax({
							url: 'assets/' + url,
							dataType: 'text',
						});
					})
				)
				.done(function () {
					let textFiles = [];
					for (var i = 0, len = arguments.length; i < len; ++i) {
						textFiles = arguments[i][0].split('\n');
						textFiles.pop();
						res.push(textFiles);
					}

					//Attach textfiles
					responseListArr.map(function (folder, index) {
						let $checkbox =
							"<div class='dropdown'><button type='button' id='drpBtn_" +
							index +
							"' class='dropbtn'>" +
							folder +
							"</button><div id='myDropdown_drpBtn_" +
							index +
							"' class='dropdown-content'><span class='checkboxes'>" +
							attachTexts(index, folder) +
							'</span></div></div>';
						$('#script_choice').append($checkbox);
					});
				})
				.fail(function (error) {
					console.log('Text File Retrieval Error: ' + error);
				});
		})
		.fail(function (error) {
			console.log('Movie Folder Retrieval Error: ' + error);
		});
	//----End: Get the lists of text files and concatenate them ----

	//----Start: "Clear All" button----
	$('#clear_all').click(function () {
		$('#input_prompt').val('');
		$('#clear_all').fadeOut('fast');
	});

	$('#input_prompt').on('input', function () {
		if (!$('#input_prompt').val()) {
			$('#clear_all').fadeOut('fast');
		} else {
			$('#clear_all').fadeIn('fast');
		}
	});
	//----End: "Clear All" button----

	//----Start: "Movie Scripts Dropdown" button----
	$(document).on('click', '.dropbtn', function () {
		$('.dropdown-content').hide();
		$('#myDropdown_' + $(this).attr('id')).fadeToggle('fast');
	});
	//----End: "Movie Scripts Dropdown" button----

	//----Start: " Change Scripts" button----
	$('#change_scripts, #submit_scripts').click(function () {
		$('.script_container').fadeToggle('fast');
	});
	//----End: "Change Scripts" button----

	//----Start: Input prompt form is submit----
	$('#prompt_form').submit(function (event) {
		let inputPrompt = $('#input_prompt').val();
		event.preventDefault();

		// If there's no previouse chat response create the container
		if (!$('.chat_response').length) {
			$('#response').append("<ul class='chat_response'></ul>");
		}

		// Append User's reponse
		let $user_response =
			"<li class='input_message'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fuser_profile.jpg?v=1619623699243' class='user_profile'></img><span class='content_container'><span class='name_date'><h3>You</h3><p>" +
			date.toLocaleTimeString() +
			'</p></span><p>' +
			inputPrompt +
			'</p></span></li>';
		$('.chat_response').append($user_response);

		// Append Automated Bot Response
		//let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>Hello, the current date is: "+date+"</p></span></li>";
		//$(".chat_response").append($bot_response);

		document.getElementById('response').scrollTop =
			document.getElementById('response').scrollHeight;
		pickResponse(inputPrompt);
	});
	//----End: Input prompt form is submit----

	//----Start: Pick Response----
	function pickResponse(inputPrompt) {
		let selected = [];
		let finalResponseList = [];
		responseList = [];

		//Check which checkboxes are selected
		$('.checkboxes span input:checked').each(function () {
			selected.push({ folder: $(this).val(), name: $(this).attr('name') });
		});

		//Get the lines from each selected movie folder text file
		$.when
			.apply(
				$,
				selected.map(function (movieText) {
					return $.ajax({
						url: 'assets/' + movieText['folder'] + '/' + movieText['name'],
						dataType: 'text',
					});
				})
			)
			.done(function () {
				//Store all the text lines as a single array
				if (selected.length === 1) {
					responseList.extend(arguments[0].split('\n'));
					responseListConcat += arguments[0];
				} else {
					for (var i = 0, len = arguments.length; i < len; ++i) {
						responseList.extend(arguments[i][0].split('\n'));
						//Concate responseList into one string
						responseListConcat += arguments[i][0];
					}
				}

				//Remove all white space and hash
				responseListHash = sha256(responseListConcat.replace(/\s+/g, ''));

				// Filter out all line breaks
				const finalResponseList = responseList.filter((sent) => sent !== '');

				//Load the data to be sent to the API - hash
				// let data = {
				//   inputPrompt: inputPrompt,
				//   responseList: responseListHash,
				//   language: "EN"
				// };

				//Load the data to be sent to the API - full script
				let data = {
					inputPrompt: inputPrompt,
					responseList: finalResponseList,
					language: 'EN',
				};

				let url =
					'https://57sunxdj45.execute-api.us-west-2.amazonaws.com/dev/convert';

				//Post data to the API (hash) and send it, if the hash doesnt work send the entire response list
				var posting = $.ajax({
					url: url,
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(data),
				});

				posting.done(function (responseData) {
					if (responseData === -1) {
						//If server doesn’t have that list cached resend entire response list
						console.log('No Hash on Server');
						let newData = {
							inputPrompt: inputPrompt,
							responseList: responseListConcat,
							language: 'EN',
						};

						var posting = $.post(url, newData);

						posting.done(function (data) {
							//If we got a response append it to the chat
							if (data) {
								let $bot_response =
									"<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>" +
									date.toLocaleTimeString() +
									'</p></span><p>' +
									data +
									'</p></span></li>';
								$('.chat_response').append($bot_response);
								document.getElementById('response').scrollTop =
									document.getElementById('response').scrollHeight;
							} else {
								console.log('Full Response List failed Data missing');
							}
						});

						posting.fail(function (data) {
							console.log('Posting Full Response List Failed');
						});
					} else {
						//If we got a response append it to the chat
						let $bot_response =
							"<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>" +
							date.toLocaleTimeString() +
							'</p></span><p>' +
							responseData +
							'</p></span></li>';
						$('.chat_response').append($bot_response);
						document.getElementById('response').scrollTop =
							document.getElementById('response').scrollHeight;
					}
				});

				posting.fail(function (data) {
					console.log('Posting Hashed Response List Failed:' + data);
				});
			})
			.fail(function (error) {
				console.log('Text File Retrieval Error: ' + error);
			});
	}
	//----End: Pick Response----
}

// Hashing Function
var sha256 = function a(b) {
	function c(a, b) {
		return (a >>> b) | (a << (32 - b));
	}
	for (
		var d,
			e,
			f = Math.pow,
			g = f(2, 32),
			h = 'length',
			i = '',
			j = [],
			k = 8 * b[h],
			l = (a.h = a.h || []),
			m = (a.k = a.k || []),
			n = m[h],
			o = {},
			p = 2;
		64 > n;
		p++
	)
		if (!o[p]) {
			for (d = 0; 313 > d; d += p) o[d] = p;
			(l[n] = (f(p, 0.5) * g) | 0), (m[n++] = (f(p, 1 / 3) * g) | 0);
		}
	for (b += '\x80'; (b[h] % 64) - 56; ) b += '\x00';
	for (d = 0; d < b[h]; d++) {
		if (((e = b.charCodeAt(d)), e >> 8)) return;
		j[d >> 2] |= e << (((3 - d) % 4) * 8);
	}
	for (j[j[h]] = (k / g) | 0, j[j[h]] = k, e = 0; e < j[h]; ) {
		var q = j.slice(e, (e += 16)),
			r = l;
		for (l = l.slice(0, 8), d = 0; 64 > d; d++) {
			var s = q[d - 15],
				t = q[d - 2],
				u = l[0],
				v = l[4],
				w =
					l[7] +
					(c(v, 6) ^ c(v, 11) ^ c(v, 25)) +
					((v & l[5]) ^ (~v & l[6])) +
					m[d] +
					(q[d] =
						16 > d
							? q[d]
							: (q[d - 16] +
									(c(s, 7) ^ c(s, 18) ^ (s >>> 3)) +
									q[d - 7] +
									(c(t, 17) ^ c(t, 19) ^ (t >>> 10))) |
							  0),
				x =
					(c(u, 2) ^ c(u, 13) ^ c(u, 22)) +
					((u & l[1]) ^ (u & l[2]) ^ (l[1] & l[2]));
			(l = [(w + x) | 0].concat(l)), (l[4] = (l[4] + w) | 0);
		}
		for (d = 0; 8 > d; d++) l[d] = (l[d] + r[d]) | 0;
	}
	for (d = 0; 8 > d; d++)
		for (e = 3; e + 1; e--) {
			var y = (l[d] >> (8 * e)) & 255;
			i += (16 > y ? 0 : '') + y.toString(16);
		}
	return i;
};

//Extending Large Arrays Function
Array.prototype.extend = function (other_array) {
	other_array.forEach(function (v) {
		this.push(v);
	}, this);
};
