function responseList(textArray) {
  let responseListArr = [];
  let responseList = [];
  let responseListConcat = "";
  let responseListHash = "";
  var time = new Date().getTime();
  var date = new Date(time);
  let assets = {};
  //----Start: Get the lists of text files and concatenate them ----
  $.when
    .apply($,textArray.map(function(url) {
        return $.ajax({
          url: "assets/",
          dataType: "text"
        });
      }))
    .done(function(result) {
      responseListArr = result[0].split("\n");
      responseListArr.pop();
      let textFileList = [];
      
      responseListArr.forEach((movie)=>{
        $.when
        .apply($,responseListArr.map(function(url) {
            return $.ajax({
              url: "assets/"+url,
              dataType: "text"
            });
          }))
        .done(function(textFile) {
          
          textFileList = textFile[0].split("\n");
          textFileList.pop();
          console.log(textFile)
        })
        .fail(function(error) {
          console.log("Text File Retrieval Error: " + error);
        });
      })
      
      responseListArr.map(function(file,index) {
        let name = file;
        // let $checkbox = "<span class='checkboxes'><input type='checkbox' id="+file+" name="+file+" value="+file+" ><label for="+file+" >"+file+" </label></span>";
        let $checkbox = "<div class='dropdown'><button type='button' id='drpBtn_"+index+"' class='dropbtn'>"+file+"</button><div id='myDropdown_drpBtn_"+index+"' class='dropdown-content'><span class='checkboxes'><span><input type='checkbox' id="+index+" /><label for="+file+" >"+file+"</label></span></span></div></div>";
        $("#script_choice").append($checkbox);
      });
    })
    .fail(function(error) {
      console.log("Text File Retrieval Error: " + error);
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
    let inputPrompt = $("#input_prompt").val();
    event.preventDefault();
    
    if(!$(".chat_response").length){
      $("#response")
      .append("<ul class='chat_response'></ul>")
    }
    
    let $user_response = "<li class='input_message'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2Fuser_profile.jpg?v=1619623699243' class='user_profile'></img><span class='content_container'><span class='name_date'><h3>You</h3><p>"+date.toLocaleTimeString() + "</p></span><p>" + inputPrompt + "</p></span></li>";
    $(".chat_response").append($user_response);
    
    // Automated Bot Response
    //let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>Hello, the current date is: "+date+"</p></span></li>";
    //$(".chat_response").append($bot_response);
    
    (document.getElementById("response")).scrollTop = (document.getElementById("response")).scrollHeight;
    pickResponse(inputPrompt);
  });
  //----End: Input prompt form is submit----
  
  //----Start: Pick Response----
  function pickResponse(inputPrompt) {
    var selected = [];
    responseList = [];
    //Dropdown
    $('.checkboxes span input:checked').each(function() {
        selected.push($(this).attr('name'));
    });
    
    // NON-Dropdown
    // $('.checkboxes input:checked').each(function() {
    //     selected.push($(this).attr('name'));
    // });
    
    // working here - try checking only 1
    console.log(selected);
    
    $.when
    .apply($,selected.map(function(url) {
        return $.ajax({
          url: "assets/"+ url,
          dataType: "text"
        });
      }))
    .done(function() {
      if(selected.length === 1){
        responseList[0] = arguments[0];
        responseListConcat += arguments[0];
        console.log("here 1");
        console.log(arguments);
      }else{
        console.log("here: " + arguments.length);
        console.log(arguments);
        for (var i = 0; i < arguments.length; i++) {
          responseList[i] = arguments[i][0];
          responseListConcat += arguments[i][0];
        }
      }
      
      responseListHash = sha256(responseListConcat);
        
      //Load the data to be sent to the API
      // let data = {
      //   inputPrompt: inputPrompt,
      //   responseList: responseListHash,
      // };

      //Test Data
      let data = {
        inputPrompt: inputPrompt,
        responseList: responseList,
        language: "EN"
      }

      console.log(data)
      
      let url = "https://57sunxdj45.execute-api.us-west-2.amazonaws.com/dev/convert";

      //Post data to the API - hash the response and send it, if the hash doesnt work send the entire response list
      var posting = $.ajax({
                        url: url,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                    });

      posting.done(function(responseData) {
        if (responseData === -1) {
          console.log("rejected")
          //If server doesn’t have that list cached
          let newData = {
            inputPrompt: inputPrompt,
            responseList: responseListConcat,
            language: "EN"
          };

          var posting = $.post(url, newData);

          posting.done(function(data) {
            if (data) {
              for (let i of data) {
                let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+ i.response + ": " + i.topscore + "</p></span></li>";
                $(".chat_response").append($bot_response);
              }
            } else {
              console.log("response failed");
            }
          });

          posting.fail(function(data) {
            console.log("Posting Full Response List Failed");
          });
        }else {
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

  //----Start: Generate Text----
  function generateText() {
    let inputPrompt = $("#input_prompt").val();
    let options = {};

    let url = "";

    let data = {
      inputPrompt: inputPrompt,
      options: options
    };

    var posting = $.post(url, data);

    posting.done(function(data) {
      let $bot_response = "<li class='bot_response'><img src='https://cdn.glitch.com/a1898aab-94e6-4c8f-8dd2-5de4e5ff6a2b%2FSteamLabs_Monogram_RGB_Black.png?v=1619620318564' class='bot_profile'></img><span class='content_container'><span class='name_date'><h3>Bot</h3><p>"+date.toLocaleTimeString() + "</p></span><p>"+data+"</p></span></li>";
      $(".chat_response").append($bot_response);
    });

    posting.fail(function(data) {
     console.log("failed");
    });
  }
  //----End: Generate Text----
}

// Hash
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
}
 