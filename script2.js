function pickResponse(inputPrompt) {
  var responseList = "Striker.txt";
  
  if (detectMood(inputPrompt, "Happy")) {
    responseList = "Austin.txt";
  }
  
  if (detectIntent(inputPrompt, ["New subscriber"])) {
    responseList = "Congratulations.txt";
  }
  
  responseList = fillInTheBlanks(inputPrompt, responseList);
  
  return bestResponse(inputPrompt, responseList);
}

















// Utility scripts

function fillInTheBlanks (inputPrompt, responseList) {
  // Use GPT-2 AI to fill in the blanks in the responselist with appropriate words
  
}

function detectIntent(inputPrompt, utteranceList) {
  // Use ConveRT to check if the input prompt is close to one of a list of utterances
  // eg: ["Where is the food bank?", "Find the food bank", "Foodbank directions", "Where are you?"]
  
}

function detectMood(inputPrompt, emotion) {
  // Use ConveRT to detect the mood of the input prompt. Happy, Sad, Inspired, etc.
  
}

function bestResponse(inputPrompt, responseList) {
  // Choose the best response from a list of responses
  
}
