/* globals appendMessage sha256 */

//----Start: Pick Response----
async function bestResponse(inputPrompt, teacher, responseList) {
  let selected = [];
  let folder = "lines";
  let response;
  
  if (responseList === "") {
    //Check which checkboxes are selected
    $(".checkboxes span input:checked").each(function() {
      selected.push({ folder: $(this).val(), name: $(this).attr("name") });
    });

    // If at least one script is chosen continue
    if (selected.length > 0) {
      appendMessage(inputPrompt) 
      response = await sendPrompt(inputPrompt, teacher, selected,folder);
    } else {
      alert("Please choose at least one script");
    }
  } else if (responseList === "*") {
    $(".checkboxes span input").each(function() {
      selected.push({ folder: $(this).val(), name: $(this).attr("name") });
    });

    if (selected.length > 0) {
      appendMessage(inputPrompt) 
      response = await sendPrompt(inputPrompt, teacher, selected, folder);
    } else {
      alert("Error: There are no scripts available.");
    }
  } else {
    let specScript = $(".checkboxes span input[name='" + responseList + "']");
    if (specScript.length > 0) {
      selected.push({
        folder: $(specScript).val(),
        name: $(specScript).attr("name")
      });
      if (selected.length > 0) {
        appendMessage(inputPrompt) 
        response = await sendPrompt(inputPrompt, teacher, selected, folder);
      } else {
        alert("Error: Your selected script is unavailable.");
      }
    } else {
      alert("The input you chose is isn't here.");
    }
  }
  return response;
}
//----End: Pick Response----


//Takes an array of objects 
function sendPrompt(inputPrompt, teacher, selected, folder) {
  let empty = false;
  let finalResponseList = [];
  let scriptPick = [];
  let responseListConcat = "";
  let responseListHash = "";

  return new Promise((resolve, reject) => {
    //Get the lines from each selected movie folder text file
    $.when
      .apply(
        $,
        selected.map(function(subfolder) {
          return $.ajax({
            url: folder+"/" + subfolder["folder"] + "/" + subfolder["name"],
            dataType: "text"
          });
        })
      )
      .done(function() {
        //Store all the text lines as a single array
        if (selected.length === 1) {
          scriptPick.extend(arguments[0].split("\n"));
          responseListConcat += arguments[0];
        } else {
          for (var i = 0, len = arguments.length; i < len; ++i) {
            scriptPick.extend(arguments[i][0].split("\n"));
            //Concate responseList into one string
            responseListConcat += arguments[i][0];
          }
        }

        //Remove all white space and hash
        // responseListHash = sha256(responseListConcat.replace(/\s+/g, ''));

        //Hash
        responseListHash = sha256(responseListConcat);

        //Testing backend Hash
        // let testHash = "I like pie Roasted goat is nice but takes a long time to {cook} a fresh fruit bowl sounds {nice}";
        // testHash = sha256(testHash);
        // console.log(testHash)

        // Filter out all line breaks and check to make sure scripts weren't empty
        empty = true;
        const finalResponseList = scriptPick.filter((sent, index) => {
          if ((!scriptPick[index] || scriptPick[index] === "") && empty) {
            empty = true;
          } else {
            empty = false;
          }
          return sent !== "";
        });

        if (!empty) {
          //Load the data to be sent to the API - Hash Test - ["I like pie","Roasted goat is nice but takes a long time to {cook}","a fresh fruit bowl sounds {nice}"]
          // responseListHash = "3dd871162843a3f634f06c25b99367f3df1f0b153d9d2a7b532b654286507e94";
          
          //Load the data to be sent to the API - hash
          let hashData = {
            inputPrompt: inputPrompt,
            responseList: responseListHash,
            language: "EN",
            consider: 3,
            apiKey: teacher
          };

          //Load the data to be sent to the API - full script
          let data = {
            inputPrompt: inputPrompt,
            responseList: finalResponseList,
            language: "EN",
            consider: 3,
            apiKey: teacher
          };

          let url =
            "https://2ehix0nexk.execute-api.us-west-2.amazonaws.com/dev/convert";

          //Post data to the API (hash) and send it, if the hash doesnt work send the entire response list
          var posting = $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(hashData),
            beforeSend: function(xhr) {
              xhr.setRequestHeader("x-api-key", teacher);
            }
          });

          posting.done(function(responseData) {
            if (responseData === -1) {
              //If server doesn’t have that list cached resend entire response list
              var posting = $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                beforeSend: function(xhr) {
                  xhr.setRequestHeader("x-api-key", teacher);
                }
              });

              posting.done(function(newResData) {
                //If we got a response append it to the chat
                if (newResData) {
                  resolve(newResData);
                } else {
                  console.log("Full Response List failed Data missing");
                  reject(new Error("Error: Please Refresh Page"));
                }
              });

              posting.fail(function(err) {
                console.log("Posting Full Response List Failed");
                reject("data");
              });
            } else {
                resolve(responseData);
            }
          });

          posting.fail(function(err) {
            console.log("Posting hashed response list failed");
            reject(new Error("Error: Incorrect teacher key - Please Re-enter your key."));
          });
        } else {
          empty = false;
          resolve(new Error("The script/s you chose were empty! Please add lines."));
        }
      })
      .fail(function(error) {
        console.log("Text File Retrieval Error: " + error);
        reject(new Error("Error: Please Refresh Page"));
      });
  }).catch(alert);
}

var sha256 = function a(b) {
  function c(a, b) {
    return (a >>> b) | (a << (32 - b));
  }
  for (
    var d,
      e,
      f = Math.pow,
      g = f(2, 32),
      h = "length",
      i = "",
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
  for (b += "\x80"; (b[h] % 64) - 56; ) b += "\x00";
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
      i += (16 > y ? 0 : "") + y.toString(16);
    }
  return i;
};
