jQuery(document).ready(function() {
  let responseList = ["testText.txt", "testText2.txt", "testText3.txt"];
  let responseListConcat = "";

  // // Get Text files for response list and concatenate
  // function getResponseList(){
  //   let responseListConcat = "";
  //   for(let i of responseList){
  //     return $.ajax({
  //           url : "assets/"+i,
  //           dataType: "text",
  //           success : function (data) {
  //             responseListConcat += data+"<br>";
  //             $("#response").html(responseListConcat);
  //           }
  //     })
  //   }
  // }
  // $.when(getResponseList()).done(function(getResponseList){
  //     console.log(getResponseList)
  // } );

  // map an array of promises

  //   //----Start: Test Response Output----
  //   let responsesTest = [
  //     {
  //       response: "The best response",
  //       topscore: 0.2989
  //     },
  //     {response: "The second best response",
  //      topscore: 0.2139
  //     },
  //     {response: "The third best response",
  //      topscore: 0.2017
  //     },
  //     {response: "The fourth best response",
  //      topscore: 0.2000
  //     },
  //     {response: "The fifth best response",
  //      topscore: 0.1985
  //     }
  //   ]

  //   var ul = document.createElement("ul");
  //   $('#response').append(ul);

  //   for(let i of responsesTest){
  //     var li = document.createElement("li");
  //     li.innerHTML = i.response+": "+ i.topscore;
  //     ul.appendChild(li);
  //   }
  //   //----End: Test Response Output----

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
    
    let resX = [];
    
    event.preventDefault();
  
    var deferreds = responseList.map(function(url) {
      // return the promise that `$.ajax` returns
      return $.ajax({
        url: "assets/" + url,
        dataType: "text"
      }).then(function(data) {
        return data;
      });
    });

    $.when(deferreds)
      .done(function(results) {
        // results will be array of each `data.value` in proper order
        var datalist = results;
        for (let i of datalist) {
          i.then(res => (resX.push(res));
        }

        let responseList = [];
        let options = {};
        pickResponse($("#input_prompt").val(), responseList, options);
      })
      .fail(function() {
        // Probably want to catch failure
      });
  });
  //----End: Input prompt form is submit----

  //----Start: Pick Response----
  function pickResponse(inputPrompt, responseList, options) {
    alert("api called: " + responseListConcat);
    //Hash the response list
    let combResponses = "";
    for (let i of responseList) {
      combResponses += responseList[i];
    }
    let responseHash = sha256(combResponses);

    //Load the data to be sent to the API
    let data = {
      inputPrompt: inputPrompt,
      responseList: responseHash,
      options: options
    };

    //Response list API url
    let url = "";

    //Post data to the API - hash the response and send it, if the hash doesnt work send the entire response list
    var posting = $.post(url, data);

    posting.done(function(responseData) {
      if (responseData === -1) {
        //If server doesn’t have that list cached
        let newData = {
          inputPrompt: inputPrompt,
          responseList: responseList,
          options: options
        };

        var posting = $.post(url, data);

        posting.done(function(data) {
          if (data) {
            var ul = document.createElement("ul");
            $("#response").append(ul);

            for (let i of data) {
              var li = document.createElement("li");
              li.innerHTML = i.response + ": " + i.topscore;
              ul.appendChild(li);
            }
          } else {
            $("#response").text("response failed");
          }
        });

        posting.fail(function(data) {
          $("#response").text("posting failed");
        });
      } else {
        var ul = document.createElement("ul");
        $("#response").append(ul);

        for (let i of data) {
          var li = document.createElement("li");
          li.innerHTML = i.response + ": " + i.topscore;
          ul.appendChild(li);
        }
      }
    });

    posting.fail(function(data) {
      $("#response").text("posting failed");
    });
  }
  //----End: Pick Response----

  //----Start: Generate Text----
  function generateText(inputPrompt, options) {
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
      $("#response").text("failed");
    });
  }
});

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
