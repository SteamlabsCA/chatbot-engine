/* globals bestResponse */

// Insert teacher API key here
let teacherKey = '';
let responseList = '*'; //Chooses all scripts
// let responseList = ""; //lets GUI decide
// let responseList = "Woody.txt"; //Choose based off text

function botResponse() {
	bestResponse(teacherKey, responseList);
}
