function pickResponse(inputPrompt) {
  var responseList = "Striker.txt";
  var responseMethod = "Best"
  
  if (detectMood(inputPrompt, "Happy")) {
    responseList = "Austin.txt";
  }
  
  if (detectMood(inputPrompt, "Angry")) {
    responseList = "Striker.txt";
  }
  
  if (detectIntent(inputPrompt, ["Make a car reservation", "Book a car", "I need to drive to Toronto"])) {
    responseList = "Book_Car.txt";
  }
  
  if (detectIntent(inputPrompt, ["Magic 8 ball"])) {
    responseMethod = "Random"
    responseList = "Random_8-ball_responses.txt";
  }
  
  responseList = fillInTheBlanks(inputPrompt, responseList);
  
  return bestResponse(inputPrompt, responseList, responseMethod);
}






// Utility scripts

function fillInTheBlanks (inputPrompt, responseList) {
  // Use GPT-2 AI to fill in the blanks in the responselist with appropriate words
  // Call the server-side API here
}

function detectIntent(inputPrompt, utteranceList) {
  // Use ConveRT to check if the input prompt is close to one of a list of utterances
  // eg: ["Where is the food bank?", "Find the food bank", "Foodbank directions", "Where are you?"]
  // Call the server-side API here
}

function detectMood(inputPrompt, emotion) {
  // Use ConveRT to detect the mood of the input prompt. Happy, Sad, Inspired, etc.
  // Call the server-side API here
}

function bestResponse(inputPrompt, responseList) {
  // Choose the best response from a list of responses using ConveRT
  // Call the server-side API here
  
}
