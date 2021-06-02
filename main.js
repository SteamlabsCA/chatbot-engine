/* globals bestResponse */

// Insert teacher API key here
let teacherKey = "wR5uUCYIL21JQxPAAJAL14VVFh62YbHD4Kjdn7om";
let responseList = "*"; //Chooses all scripts
// let responseList = ""; //lets GUI decide
// let responseList = "Woody.txt"; //Choose based off text

function botResponse() {
  bestResponse(teacherKey, responseList);
}