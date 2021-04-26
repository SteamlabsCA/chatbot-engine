jQuery(document).ready(function() {
  let responseList = ["testText.txt", "testText2.txt"];
  let responseListConcat = "";
  let responseListHash = "";
  var time = new Date().getTime(); // get your number
  var date = new Date(time); // create Date object

  console.log(date.toString()); // result: Wed Jan 12 2011 12:42:46 GMT-0800 (PST)
  //----Start: Test Response Output----
  let responsesTest = [
    {
      response: "The best response",
      topscore: 0.2989
    },
    // { response: "The second best response", topscore: 0.2139 },
    // { response: "The third best response", topscore: 0.2017 },
    // { response: "The fourth best response", topscore: 0.2 },
    // { response: "The fifth best response", topscore: 0.1985 }
  ];

  $("#response")
    .append("<ul class='chat_response'></ul>")
  for (let i of responsesTest) {
    let $bot_response = "<li class='bot_response'><span class='bot_profile'></span><span class='content_container'><span><h3>Bot</h3><p>"+date.toString()+"</p></span><p>" + i.response + ": " + i.topscore + "</p></span></li>";
    $(".chat_response").append($bot_response);
  }
  //----End: Test Response Output----

  //----Start: Get the lists of text files and concatenate them ----
  $.when
    .apply(
      $,
      responseList.map(function(url) {
        return $.ajax({
          url: "assets/" + url,
          dataType: "text"
        });
      })
    )
    .done(function() {
      var results = [];
      for (var i = 0; i < arguments.length; i++) {
        responseListConcat += arguments[i][0];
      }
      responseListHash = sha256(responseListConcat);
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

  //----Start: Input prompt form is submit----
  $("#prompt_form").submit(function(event) {
    let inputPrompt = $("#input_prompt").val();
    event.preventDefault();
    
    if(!$(".chat_response").length){
      $("#response")
      .append("<ul class='chat_response'></ul>")
    }
    
    let $user_response = "<li class='input_message'><span class='user_profile'></span><span class='content_container'><h3>User</h3><p>" + inputPrompt + "</p></span></li>";
    $(".chat_response").append($user_response);
    
    let $bot_response = "<li class='bot_response'><span class='bot_profile'></span><span class='content_container'><h3>Bot</h3><p>boop beep boop bop!!! boop beep boop bop!!! boop beep boop bop!!!</p></span></li>";
    $(".chat_response").append($bot_response);
    
    pickResponse(inputPrompt);
  });
  //----End: Input prompt form is submit----

  //----Start: Pick Response----
  function pickResponse(inputPrompt) {
    let options = {};

    //Load the data to be sent to the API
    let data = {
      inputPrompt: inputPrompt,
      responseList: responseListHash,
      options: options
    };

    console.log(data);

    //Response list API url
    let url = "";

    //Post data to the API - hash the response and send it, if the hash doesnt work send the entire response list
    var posting = $.post(url, data);

    posting.done(function(responseData) {
      if (responseData === -1) {
        //If server doesn’t have that list cached
        let newData = {
          inputPrompt: inputPrompt,
          responseList: responseListConcat,
          options: options
        };

        var posting = $.post(url, newData);

        posting.done(function(data) {
          if (data) {
            $("#response")
              .append("<ul></ul>")
              .addClass("chat_response");
            for (let i of data) {
              $(".chat_response").append(
                "<li>" + i.response + ": " + i.topscore + "</li>"
              );
            }
          } else {
            $(".api_return").text("response failed");
          }
        });

        posting.fail(function(data) {
          $(".api_return").text("Posting Full Response List Failed");
        });
      } else {
        $("#response")
          .append("<ul></ul>")
          .addClass("chat_response");
        for (let i of responseData) {
          $(".chat_response").append(
            "<li>" + i.response + ": " + i.topscore + "</li>"
          );
        }
      }
    });

    posting.fail(function(data) {
      $(".api_return").text("Posting Hashed Response List Failed");
      // $("#response").text("Posting Hashed Response List Failed");
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
      $("#response").text(data[0].response);
    });

    posting.fail(function(data) {
      $(".api_return").text("failed");
    });
  }
});
//----End: Generate Text----

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
};
