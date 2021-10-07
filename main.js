// Insert teacher API key here
let teacherKey = 'fCoRU16bE23TvHm79DKw3U4v4n0EzFI2j5NoA00g';

//NO-Norwegian, FR-French, EN-English,
let language = 'EN';

let responseListOrg = '*'; //Chooses all scripts
// let responseListOrg = ""; //lets GUI decide
// let responseListOrg = 'Woody.txt'; //Choose based off text

async function botResponse(inputPrompt) {
	if (await detectMood(inputPrompt, 'Happy')) {
		responseList = 'character2.txt';
	}

	// let responseChoice = await detectIntent(inputPrompt, ['rent a car', 'rent a bike', 'book a flight']);
	// if (responseChoice === 'rent a car') {
	// 	responseList = 'car.txt';
	// }

	// if (responseChoice === 'rent a bike') {
	// 	responseList = 'bike.txt';
	// }

	// if (responseChoice === 'book a flight') {
	// 	responseList = 'flight.txt';
	// }

	fillInTheBlanks();

	let response = await bestResponse(inputPrompt, teacherKey, responseList);
	return response;
}

/* globals bestResponse detectMood detectIntent detectMode responseList fillInTheBlanks*/
