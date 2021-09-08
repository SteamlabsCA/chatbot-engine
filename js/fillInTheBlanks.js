/* globals detectMode responseList responseListOrg*/

function fillInTheBlanks() {
	if (!detectMode) {
		responseList = responseListOrg;
	} else {
		detectMode = false;
	}
}
