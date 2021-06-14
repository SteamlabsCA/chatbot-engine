
// Insert teacher API key here
let teacherKey = "";

let responseListOrg = "*"; //Chooses all scripts
// let responseListOrg = ""; //lets GUI decide
// let responseListOrg = "Woody.txt"; //Choose based off text


async function botResponse(inputPrompt){
// if (await detectMood(inputPrompt, "Happy")) {
//   responseList = "character2.txt";
// }
  
//   let response = await detectIntent(inputPrompt, ["rent a car","rent a bike","book a flight"]) 
//   if (response === "rent a car") {
//     responseList = "car.txt";
//   }
  
//   if (response === "rent a bike") {
//     responseList = "bike.txt";
//   }
  
//   if (response === "book a flight") {
//     responseList = "flight.txt";
//   }
  
  fillInTheBlanks();
  return await bestResponse(inputPrompt, teacherKey, responseList)
}























/* globals bestResponse detectMood detectIntent detectMode responseList fillInTheBlanks*/