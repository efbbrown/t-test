function getVals() {
  var values = [];
  $('.group.input.num').each(function() {
    values.push(+$(this).val());
  });
  var conflevel = +$("#confint").val();
  var numTails = +$("input[name=tail]", "#tails").val();
  return [values, conflevel, numTails];
}

function getGroups() {
  var values = [];
  $('.group.input.text').each(function() {
    values.push($(this).val());
  });
  return values;
}

drawChartHor = function(cobj) {
  
  d3.selectAll(cobj.parent + " *").remove();
  
  var parentDiv = d3.select(cobj.parent);
  
  // Chart width and height, dependent on parentDiv and marginRatio 
  var parentWidth = g3.elementWidth(parentDiv),
      parentHeight = g3.elementHeight(parentDiv);
  
  var margin = {
    top: parentHeight * cobj.margin.top, right: parentWidth * cobj.margin.right,
    bottom: parentHeight * cobj.margin.bottom, left: Math.max(80, parentWidth * cobj.margin.left)
  };
  
  // Add chart svg to parentDiv
  chart = g3.appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  var width = g3.chartLength(parentWidth, margin.left, margin.right),
      height = g3.chartLength(parentHeight, margin.top, margin.bottom);
  
  var x = g3.scale({type: "linear", min: 0, max: width});
  var y = g3.scale({type: "ordinal", min: 0, max: height, space: 0.8});
  
  var xrange = d3.extent(d3.extent(cobj.data, function(d) { return d["lower"]; }).concat(d3.extent(cobj.data, function(d) { return d["upper"]; })));
  
  x.domain([d3.min(xrange) - 0.3*(d3.max(xrange) - d3.min(xrange)),
            d3.max(xrange) + 0.3*(d3.max(xrange) - d3.min(xrange))
            ]);
  y.domain(cobj.data.map(function(d) { return d[cobj.yvar]; }));
  
  var formatPercent = d3.format(",.1%");
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    //.tickFormat(formatPercent)
    .ticks(4);
    
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
  
  chart.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr("x", width/2)
    .attr("y", -40)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Success Rate");

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  chart.append("g")
    .attr("class", "lowerBounds")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line")
    .attr("class", function(d, i) { return "chartLine s" + i; })
    .attr("y1", function(d) { return y(d[cobj.yvar]); })
    .attr("x1", function(d) { return x(d.lower); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 1*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.lower); })
    .on("mouseover", showTooltip)
    .on("mouseout", removeTooltip);
  
  chart.append("g")
    .attr("class", "upperBounds")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line")
    .attr("class", function(d, i) { return "chartLine s" + i; })
    .attr("y1", function(d) { return y(d[cobj.yvar]); })
    .attr("x1", function(d) { return x(d.upper); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 1*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.upper); })
    .on("mouseover", showTooltip)
    .on("mouseout", removeTooltip);
  
  gConfInts = chart.append("g")
    .attr("class", "lines");
  
  gConfInts.selectAll("line")
    .attr("class", "confint")
    .data(cobj.data)
    .enter().append("line")
    .attr("class", function(d, i) { return "chartLine s" + i; })
    .attr("y1", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("x1", function(d) { return x(d.lower); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.upper); })
    .on("mouseover", showTooltip)
    .on("mouseout", removeTooltip);

  chart.append("g")
    .selectAll("circle")
    .data(cobj.data)
    .enter().append("circle")
    .attr("class", function(d, i) { return "circles s" + i; })
    .attr("cx", function(d) { return x(d[cobj.xvar]); })
    .attr("cy", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("r", 5)
    .style("fill", "#000")
    .on("mouseover", showTooltip)
    .on("mouseout", removeTooltip);
  
  chart.append("g")
    .selectAll("text")
    .data(cobj.data)
    .enter().append("text")
    .attr("class", function(d, i) { return "texts s" + i; })
    .attr("x", function(d) { return x(d['lower']) - 5; })
    .attr("y", function(d) { return y(d[cobj.yvar]) + 0.1*y.rangeBand(); })
    .attr("dy", ".25em")
    .text(function(d) { return d.lower; })
    .style("text-anchor", "end");
  
  chart.append("g")
    .selectAll("text")
    .data(cobj.data)
    .enter().append("text")
    .attr("class", function(d, i) { return "texts s" + i; })
    .attr("x", function(d) { return x(d['upper']) + 5; })
    .attr("y", function(d) { return y(d[cobj.yvar]) + 0.1*y.rangeBand(); })
    .attr("dy", ".25em")
    .text(function(d) { return d.upper; })
    .style("text-anchor", "start");
    
};

// From http://bl.ocks.org/nbremer/801c4bb101e86d19a1d0
showTooltip = function(d, i) {
  
  console.log(i);
  
	var element = d3.selectAll(".circles.s" + i);
	
	var contentLines = [
	  "<span style='font-size: 14px; text-align: center;'><b>" + d.groupName + "</b></span><br>",
	  "<span style='font-size: 14px; text-align: center;'><b>Mean: " + "</b>" + d.mu + "</span><br>",
	  "<span style='font-size: 14px; text-align: center;'><b>Conf. Interval: " + "</b>[" + d.lower + ", " + d.upper + "]</span><br>"
	];
	/*
	createContent = function(d) {
	  if (d["Remark"].length > 0) {
	    contentLines[1] = "<span style='font-size: 11px; text-align: center;'>" + "Also included: <b>" + d.PrettyRemark + "</b></span><br>";
	    return contentLines;
	  } else {
	    return contentLines;
	  }
	};
	*/
	var contentString = contentLines;
	
	//Define and show the tooltip
	$(element).popover({
		placement: 'auto top',
		container: '#chart',
		trigger: 'manual',
		html : true,
		content: contentString
	});
	
	$(element).popover('show');
  
};

removeTooltip = function(d, i) {

	var element = d3.selectAll(".circles.s");
	
	//Hide tooltip
	$('.popover').each(function() {
		$(this).remove();
	});
		
};
