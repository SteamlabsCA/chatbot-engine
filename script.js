import sha256 from './js/hash.js';

function responseList() {
  alert("hello: "+ sha256("hello"))
  let responseListArr = [];
  let responseList = [];
  let responseListConcat = "";
  let responseListHash = "";
  var time = new Date().getTime();
  var date = new Date(time);
  let res = [];
  
  // Attach the checklist to each dropdown
  function attachTexts(id,folder){
    let checkList = "";
    for (var index = 0, len = res[id].length; index < len; ++index) {
      checkList += "<span id='search_box'><input type='checkbox' id='"+id+index+"' name='"+res[id][index]+"' value='"+folder+"'/><label class='file_name'>"+res[id][index]+"</label></span>"
    }
    return checkList;
  }
  
  //----Start: Get the lists of text files and concatenate them ----
  //Get All Movie Folders
  $.when
    .apply($,([1,2]).map(function(url) {
        return $.ajax({
          url: "assets/",
          dataType: "text"
        });
      }))
    .done(function(result) {
      //Store all movie folders split on the newline
      responseListArr = result[0].split("\n");
      responseListArr.pop();
      
      //Get all text files in the movie folders
      $.when
      .apply($,responseListArr.map(function(url) {
          return $.ajax({
            url: "assets/"+url,
            dataType: "text"
          });
        }))
      .done(function() {
        let textFiles = [];
        for (var i = 0, len = arguments.length; i < len; ++i) {
          textFiles = arguments[i][0].split("\n");
          textFiles.pop();
          res.push(textFiles);
        }
        
        //Attach textfiles
        responseListArr.map(function(folder,index) {
          let $checkbox = "<div class='dropdown' id='movie_"+index+"' ><button type='button' id='drpBtn_"+index+"' class='dropbtn'>"+folder+"</button><div id='myDropdown_drpBtn_"+index+"' class='dropdown-content'><span class='checkboxes'>"+attachTexts(index,folder)+"</span></div></div>";
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

  //----Start: "Clear All" button----
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
  //----End: "Clear All" button----

  
  
  //----Start: "Movie Scripts Dropdown" button----
  $(document).on('click', '.dropbtn', function(){
    $(".dropdown-content").hide();
    $("#myDropdown_"+$(this).attr('id')).fadeToggle("fast");
  });
  //----End: "Movie Scripts Dropdown" button----
  
  //----Start: " Change Scripts" button----
  $("#change_scripts, #submit_scripts").click(function() {
    $(".script_container").fadeToggle("fast");
  });
  //----End: "Change Scripts" button----
  
  //----Start: Input prompt form is submit----
  $("#prompt_form").submit(function(event) {
    event.preventDefault();
    let selected=[];
    let inputPrompt = $("#input_prompt").val();
    
    //Check which checkboxes are selected
    $('.checkboxes span input:checked').each(function() {
        selected.push({folder: $(this).val(),name:$(this).attr('name')});
    });
    
    // If at least one script is chosen continue
    if(selected.length > 0){ 
      // If there's no previouse chat response create the container
      if(!$(".chat_response").length){
        $("#response")
        .append("<ul class='chat_response'></ul>")
      }

      // Append User's reponse
      let $user_response = "<li class='input_message'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fuser_profile.jpg?v=1619623699243' class='user_profile'></img><span class='content_container'><span class='name_date'><h3>You</h3><p>"+date.toLocaleTimeString() + "</p></span><p>" + inputPrompt + "</p></span></li>";
      $(".chat_response").append($user_response);

      // Append Automated Bot Response
      //let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>Hello, the current date is: "+date+"</p></span></li>";
      //$(".chat_response").append($bot_response);

      (document.getElementById("response")).scrollTop = (document.getElementById("response")).scrollHeight;
      pickResponse(inputPrompt,selected);
    }else{
      alert("Please Choose at least one script");
    }
  });
  //----End: Input prompt form is submit----
  
  //----Start: Pick Response----
  function pickResponse(inputPrompt,selected) {
    let finalResponseList = []; 
    responseList = [];
    
    //Get the lines from each selected movie folder text file
    $.when
    .apply($,selected.map(function(movieText) {
        return $.ajax({
          url: "assets/"+ movieText["folder"]+"/"+movieText["name"],
          dataType: "text"
        });
      }))
    .done(function() {
      //Store all the text lines as a single array
      if(selected.length === 1){
        responseList.extend(arguments[0].split("\n"));
        responseListConcat += arguments[0];
      }else{
        for (var i = 0, len = arguments.length; i < len; ++i) {
          responseList.extend(arguments[i][0].split("\n"));
          //Concate responseList into one string
          responseListConcat += arguments[i][0];
        }
      }
      
      //Remove all white space and hash
      responseListHash = sha256(responseListConcat.replace(/\s+/g, ''));
      
      // Filter out all line breaks
      const finalResponseList = responseList.filter(sent => sent !== "");
      
      //Load the data to be sent to the API - hash
      // let data = {
      //   inputPrompt: inputPrompt,
      //   responseList: responseListHash,
      //   language: "EN"
      // };
            
      //Load the data to be sent to the API - full script
      let data = {
        inputPrompt: inputPrompt,
        responseList: finalResponseList,
        language: "EN"
      }
      
      let url = "https://57sunxdj45.execute-api.us-west-2.amazonaws.com/dev/convert";
      
      //Post data to the API (hash) and send it, if the hash doesnt work send the entire response list
      var posting = $.ajax({
                        url: url,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                    });

      posting.done(function(responseData) {
        if (responseData === -1) {
          //If server doesn’t have that list cached resend entire response list
          console.log("No Hash on Server")
          let newData = {
            inputPrompt: inputPrompt,
            responseList: responseListConcat,
            language: "EN"
          };

          var posting = $.post(url, newData);

          posting.done(function(data) {
            //If we got a response append it to the chat
            if (data) {
              let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+ data+ "</p></span></li>";
              $(".chat_response").append($bot_response);
              (document.getElementById("response")).scrollTop = (document.getElementById("response")).scrollHeight;
            } else {
              console.log("Full Response List failed Data missing");
            }
          });

          posting.fail(function(data) {
            console.log("Posting Full Response List Failed");
          });
        } else {
          //If we got a response append it to the chat
          let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+ responseData+ "</p></span></li>";
          $(".chat_response").append($bot_response);
          (document.getElementById("response")).scrollTop = (document.getElementById("response")).scrollHeight;
        }
      });

      posting.fail(function(data) {
        console.log("Posting Hashed Response List Failed:" + data);
      });
    })
    .fail(function(error) {
      console.log("Text File Retrieval Error: " + error);
    });
  }
  //----End: Pick Response----
}

// Search By characteer
function charSearch() {
  var input, filter, checkbox, name, i, txtValue, parent,allParents;
  input = document.getElementById("script_input");
  filter = input.value.toUpperCase();
  checkbox = document.querySelectorAll('[id=search_box]');
  allParents = $(".dropdown");
  for (i = 0; i < checkbox.length; i++) { 
    name = checkbox[i].getElementsByClassName("file_name");
    txtValue = name[0].textContent || name[0].innerText; 
    if (txtValue.toUpperCase().indexOf(filter) > -1) { 
      checkbox[i].style.display = "block";
    } else {
      checkbox[i].style.display = "none";
    }
  }
  
  for (i = 0; i <= allParents.length-1; i++) { 
    let t = $("#movie_"+i+" .checkboxes").children().filter(function(){ return $(this).css("display")=="block"});
    if(t.length <= 0){
      console.log($("#movie_"+i));
      $("#movie_"+i).hide();
    }else{
      $("#movie_"+i).show();
    }
  }
}

//Extending Large Arrays Function
Array.prototype.extend = function (other_array) {
    other_array.forEach(function(v) {this.push(v)}, this);
}

