
function initData() {
//Add your custom responses here

var responses = [
  "Jeez, for a guy with a ton of clocks, you sure don't pay much attention to time.",
  "Show me the money!",
  "I'm late!",
  "xckjfh jskdh"
];

// Choose some movie characters to include
var characters = [
  "airplane: striker",
  "airplane: Elaine"
]

// Include some AI generated responses from GPT-2 based on some question prompts. Change these prompts to your liking

for (var i = 0; i < 5; i++) {
  responses.push(GPT2Generate("What should we order for dinner?"));
}

for (var i = 0; i < 5; i++) {
  responses.push(GPT2Generate("What do you think of this t-shirt?"));
}


// Add some scripted answers to specific questions

var customQuestion = "What time is it?";
var customAnswer = Date.now();
}

function GPT2Generate(textPrompt) {
  // Call GPT2 API
  
}

