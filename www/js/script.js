var data;

$(document).ready(function() {
  
  /************************************************/
  /*          Get window size properties          */
  /************************************************/
  
  var windowWidth = window.innerWidth, windowHeight = window.innerHeight,
      aspectRatio = windowWidth/windowHeight;
  
  //if windowWidth > 
  
  /************************************************/
  /*          Insert table, add/remove rows when  */
  /************************************************/
  
  var inputTable = $("<table/>").attr("class", "group figures").html("<tr><th></th><th>Sample Size</th><th>Mean</th><th>S.D</th></tr>");
  
  $("#table-container").append(inputTable);
  
  var newRowStart = '<tr><td><input class="group input text" type="text" value="Sample ',
      newRowEnd = '" style="display: inline-block; width: 100%;"></td><td><input class="group input num" type="number" value="50" min="0" style="display: inline-block; width: 100%;"></td><td><input class="group input num" type="number" value="20" min="1" style="display: inline-block; width: 100%;"></td><td><input class="group input num" type="number" value="3" min="1" style="display: inline-block; width: 100%;"></td></tr>';
  
  var numGroups = 2;
  
  for (i = 0; i < 2; i++) {
    
    $(".group.figures tr:last").after(newRowStart + (i + 1) + newRowEnd);
    
  }
  
  /************************************************/
  /*          Append slider input                 */
  /************************************************/
  
  var confint = $( "#confint" );
  $("#slider-range").slider({
    range: "max",
    min: 50,
    max: 99.99,
    value: +confint.val(),
    step: 0.01,
    slide: function( event, ui ) {
      $( "#confint" ).val( ui.value );
    }
  });
  $("#confint").val($("#slider-range").slider("value"));
  
  /************************************************/
  /*          Send & receive R data               */
  /************************************************/
  
  $("#run").click(function() {
    var values = getVals();
    console.log(values);
    if (values[0] < 2 || values[3] < 2) {
      console.log("Size must be > 1 for both sample groups");
    } else if (values[2] === 0 || values[5] === 0) {
      console.log("S.D must be > 0 for both sample groups");
    } else {
      Shiny.onInputChange("values", values);
      $("#output-container").removeClass("hidden");
    }
  });
  
  Shiny.addCustomMessageHandler("jsonData", function(jsonData) {
    
    var p_value = jsonData[0][0];
    data = jsonData[1];
    
    var groupNames = getGroups();
    data.forEach(function(d, i) { d.groupName = groupNames[i] });
    
    console.log(p_value);
    console.log(data);
    console.log(groupNames);
    
    var chartStyles = {width: "100%"};
    
    if (numGroups < 5) { chartStyles.height = 300; }
    if (numGroups > 4) { chartStyles.height = numGroups * 60; }
    
    $("#chart").css(chartStyles);
    
    var cobjHor = {
      "parent": "#chart",
      "data": data,
      "xvar": "mu",
      "yvar": "groupName",
      "margin": {
        "top": 0.18, "right": 0.10,
        "bottom": 0.10, "left": 0.10
      }
    };
    
    drawChartHor(cobjHor);
    
    if (p_value == 0.00001) {
      $("#p-value").html(" < .0001");
    } else {
      $("#p-value").html(" = " + p_value);
    }
    
    var $accept = $("#accept"), $verdict = $("#verdict"),
        $conflevel = $("#conf-level"), $confint = +$("#confint").val(),
        $siglev = 1 - $confint/100;

    $conflevel.html(" " + $confint + "%");

    if (p_value < $siglev) {
      $accept.css({"background-color": "#10a708"}).html("Yes");
      $verdict.html("There is evidence to suggest with 95% confidence that the means of the sample populations are unequal.");
    } else if (p_value > $siglev) {
      $accept.css({"background-color": "#aa3939"}).html("No");
      $verdict.html("There is insufficient evidence to conclude that the means of the sample populations are unequal.");
    }
    
  });
  
});
