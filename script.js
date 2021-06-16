/* globals bestResponse responseList charSearch botResponse  teacherKey*/

let detectMode = false;
let responseList = '';

jQuery(document).ready(function() {
  $("#start").click(function() {
    if (teacherKey.length > 0) {
       
      $("#start_container").fadeOut("fast", function() {
        $(".activity").fadeIn("fast");
        chatbot(teacherKey);
      });
    } else {
      alert("Missing Teacher API key");
    }
  });
});

async function chatbot(teacher) {
  let responseListArr = [];
  let res = [];
  //----Start: Get the lists of text files and concatenate them ----
  $.when
    //Get All Movie Folders
    .apply(
      $,
      [1, 2].map(function() {
        return $.ajax({
          url: "lines/",
          dataType: "text"
        });
      })
    )
    .done(function(result) {
      //Store all movie folders split on the newline
      if (result.length === 2) {
        responseListArr = result[0];
      } else {
        responseListArr = result[0].split("\n");
      }
      responseListArr.pop();

      //Get all text files in the movie folders
      $.when
        .apply(
          $,
          responseListArr.map(function(url) {
            return $.ajax({
              url: "lines/" + url,
              dataType: "text"
            });
          })
        )
        .done(function() {
          let textFiles = [];
          if (arguments.length === 3) {
            textFiles = arguments[0].split("\n");
            textFiles.pop();
            res.push(textFiles);
          } else {
            for (var i = 0, len = arguments.length; i < len; ++i) {
              textFiles = arguments[i][0].split("\n");
              textFiles.pop();
              res.push(textFiles);
            }
          }

          //Attach textfiles
          responseListArr.map(function(folder, index) {
            let $checkbox =
              "<div class='dropdown' id='movie_" +
              index +
              "' ><button type='button' id='drpBtn_" +
              index +
              "' class='dropbtn'>" +
              folder +
              "</button><div id='myDropdown_drpBtn_" +
              index +
              "' class='dropdown-content'><span class='checkboxes'>" +
              attachTexts(index, folder) +
              "</span></div></div>";
            $("#script_choice").append($checkbox);
          });
        })
        .fail(function(error) {
          console.log("Text File Retrieval Error: " + error);
        });
    })
    .fail(function(error) {
      console.log("Movie Folder Retrieval Error: " + error);
    });
  //----End: Get the lists of text files and concatenate them ----

  //----Start: "Clear All Text" button----
  $("#clear_all").click(function() {
    $("#input_prompt").val("");
    $("#clear_all").fadeOut("fast");
  });

  $("#input_prompt").on("input", function() {
    if (!$("#input_prompt").val()) {
      $("#clear_all").fadeOut("fast");
    } else {
      $("#clear_all").fadeIn("fast");
    }
  });
  //----End: "Clear All Text" button----

  //----Start: "Clear All Checkboxes" button----
  $("#clear_checkboxes").click(function() {
    $(".checkboxes span input:checked").each(function() {
      this.checked = false;
    });
  });
  //----End: "Clear All Checkboxes" button----

  //----Start: "Movie Scripts Dropdown" button----
  $(document).on("click", ".dropbtn", function() {
    // $(".dropdown-content").hide();
    if ($("#myDropdown_" + $(this).attr("id")).css("display") == "none") {
      $(".dropdown-content").fadeOut("fast");
      $("#myDropdown_" + $(this).attr("id")).fadeIn("fast");
    } else {
      $("#myDropdown_" + $(this).attr("id")).fadeOut("fast");
    }
  });
  //----End: "Movie Scripts Dropdown" button----

  // Attach the checklist to each dropdown
  function attachTexts(id, folder) {
    let checkList = "";
    for (var index = 0, len = res[id].length; index < len; ++index) {
      checkList +=
        "<span id='search_box'><input class='checkbox' type='checkbox' id='" +
        id +
        index +
        "' name='" +
        res[id][index] +
        "' value='" +
        folder +
        "'/><label class='file_name'>" +
        res[id][index] +
        "</label></span>";
    }
    return checkList;
  }

  //----Start: " Change Scripts" button----
  $("#change_scripts, #submit_scripts").click(function() {
    charSearch();
    $(".script_container").fadeToggle("fast");
  });
  //----End: "Change Scripts" button----

  //----Start: Input prompt form is submit----
  $("#prompt_form").submit(async function(event) {
    event.preventDefault();
    let inputPrompt = $("#input_prompt").val();
    if(!($(".chat_response")
                    .children(".bot_response")
                    .last()
                    .children(".content_container")
                    .children("p")
                    .text() ===  '...')){
      
      
      let response = await botResponse(inputPrompt);
      if(response){
        //If we got a response append it to the chat
        // let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+ responseData+ "</p></span></li>";
        // $(".chat_response").append($bot_response);
        //Replace bot waiting with response
        $(".chat_response")
          .children(".bot_response")
          .last()
          .children(".content_container")
          .children("p")
          .removeClass( "loading" )
        $(".chat_response")
          .children(".bot_response")
          .last()
          .children(".content_container")
          .children("p")
          .text(response);
        document.getElementById(
          "response"
        ).scrollTop = document.getElementById(
          "response"
        ).scrollHeight;
      }else{
        $(".chat_response")
          .children(".bot_response")
          .last()
          .children(".content_container")
          .children("p")
          .text("Uh-oh! An error occurred could you refresh the page?");
        document.getElementById(
          "response"
        ).scrollTop = document.getElementById(
          "response"
        ).scrollHeight;
      }
    }
  });
  //----End: Input prompt form is submit----
    
  }


//Extending Large Arrays Function
Array.prototype.extend = function(other_array) {
  other_array.forEach(function(v) {
    this.push(v);
  }, this);
};

