//----Start: Pick Response----
  function pickResponse(inputPrompt, selected) {
    finalResponseList = [];
    scriptPick = [];

    //Get the lines from each selected movie folder text file
    $.when
      .apply(
        $,
        selected.map(function(movieText) {
          return $.ajax({
            url: "lines/" + movieText["folder"] + "/" + movieText["name"],
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
          // If there's no previouse chat response create the container
          if (!$(".chat_response").length) {
            $("#response").append("<ul class='chat_response'></ul>");
          }

          // Append User's reponse
          let $user_response =
            "<li class='input_message'><span class='content_container'><p class='user_p'>" +
            inputPrompt +
            "</p><span class='name_date'><p class='bold_p'>You </p><p class='p_time'>" +
            date.toLocaleTimeString() +
            "</p></span></span><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fperson.png?v=1622144125311' class='user_profile'></img></li>";
          $(".chat_response").append($user_response);

          // Bot is typing Response
          let $bot_response =
            "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fbot.png?v=1622144125211' class='bot_profile'></img><span class='content_container'><p class='bot_p'>Thinking...</p><span class='name_date'><p class='bold_p'>Bot </p><p class='p_time'>" +
            date.toLocaleTimeString() +
            "</p></span></span></li>";
          $(".chat_response").append($bot_response);

          // Append Automated Bot Response
          //let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>Hello, the current date is: "+date+"</p></span></li>";
          //$(".chat_response").append($bot_response);

          document.getElementById(
            "response"
          ).scrollTop = document.getElementById("response").scrollHeight;

          //Load the data to be sent to the API - Hash Test - ["I like pie","Roasted goat is nice but takes a long time to {cook}","a fresh fruit bowl sounds {nice}"]
          // responseListHash = "3dd871162843a3f634f06c25b99367f3df1f0b153d9d2a7b532b654286507e94";

          //Load the data to be sent to the API - hash
          let hashData = {
            inputPrompt: inputPrompt,
            responseList: responseListHash,
            language: "EN"
          };

          //Load the data to be sent to the API - full script
          let data = {
            inputPrompt: inputPrompt,
            responseList: finalResponseList,
            language: "EN"
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
              //test
              // console.log("No Hash on Server");

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
                  //Replace bot waiting with response
                  $(".chat_response")
                    .children(".bot_response")
                    .last()
                    .children(".content_container")
                    .children("p")
                    .text(newResData);
                  document.getElementById(
                    "response"
                  ).scrollTop = document.getElementById(
                    "response"
                  ).scrollHeight;
                } else {
                  console.log("Full Response List failed Data missing");
                }
              });

              posting.fail(function(err) {
                console.log("Posting Full Response List Failed" + err);
              });
            } else {
              //If we got a response append it to the chat
              // let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+ responseData+ "</p></span></li>";
              // $(".chat_response").append($bot_response);

              //Replace bot waiting with response
              $(".chat_response")
                .children(".bot_response")
                .last()
                .children(".content_container")
                .children("p")
                .text(responseData);
              document.getElementById(
                "response"
              ).scrollTop = document.getElementById("response").scrollHeight;
            }
          });

          posting.fail(function(err) {
            console.log("Posting hashed response list failed");
            alert("Error: Incorrect teacher key - Please Re-enter your key.");
          });
        } else {
          alert("The script/s you chose were empty! Please add lines.");
          empty = false;
        }
      })
      .fail(function(error) {
        console.log("Text File Retrieval Error: " + error);
      });
  }
  //----End: Pick Response----