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

drawChart = function(cobj) {
  
  d3.selectAll(cobj.parent + " *").remove();
  
  var parentDiv = d3.select(cobj.parent);
  
  // Chart width and height, dependent on parentDiv and marginRatio 
  var parentWidth = g3.elementWidth(parentDiv),
      parentHeight = g3.elementHeight(parentDiv);
  
  var margin = {
    top: parentHeight * cobj.margin.top, right: parentWidth * cobj.margin.right,
    bottom: parentHeight * cobj.margin.bottom, left: parentWidth * cobj.margin.left
  };
  
  // Add chart svg to parentDiv
  chart = g3.appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  var width = g3.chartLength(parentWidth, margin.left, margin.right),
      height = g3.chartLength(parentHeight, margin.top, margin.bottom);
  
  var x = g3.scale({type: "ordinal", min: 0, max: width, space: 0.95});
  var y = g3.scale({type: "linear", min: height, max: 0});
  
  var yrange = d3.extent(d3.extent(cobj.data, function(d) { return d["lower"]; }).concat(d3.extent(cobj.data, function(d) { return d["upper"]; })));
  
  x.domain(cobj.data.map(function(d) { return d[cobj.xvar]; }));
  y.domain([d3.min(yrange) - 0.5*(d3.max(yrange) - d3.min(yrange)),
            d3.max(yrange) + 0.5*(d3.max(yrange) - d3.min(yrange))
            ]);
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
  
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Success Rate");
  /*
  chart.append("g")
    .attr("class", "lines")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line")
    .attr("x1", function(d) { return x(d[cobj.xvar]); })
    .attr("x2", function(d) { return x(d[cobj.xvar]); })
    .attr("y1", function(d) { return y(d.lower); })
    .attr("y2", function(d) { return y(d.upper); })
    .attr("stroke-width", 2);
  */
  chart.append("g")
    .attr("class", "rects")
    .selectAll("rect")
    .data(cobj.data)
    .enter().append("rect")
    .attr("x", function(d) { return x(d[cobj.xvar]); })
    .attr("y", function(d) { return y(d.upper); })
    .attr("height", function(d) { return y(d.lower) - y(d.upper); })
    .attr("width", x.rangeBand())
    .style("fill", "#cc0000");//x.rangeRoundBand());
    //.attr("stroke-width", 2);
  
  chart.append("g")
    .attr("class", "circles")
    .selectAll("circle")
    .data(cobj.data)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d[cobj.xvar]) + 0.5*x.rangeBand(); })
    .attr("cy", function(d) { return y(d[cobj.yvar]); })
    .attr("r", x.rangeBand())
    .style("fill", "#000");
  
};

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
  /*
  chart.append("g")
    .attr("class", "lines")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line")
    .attr("x1", function(d) { return x(d[cobj.xvar]); })
    .attr("x2", function(d) { return x(d[cobj.xvar]); })
    .attr("y1", function(d) { return y(d.lower); })
    .attr("y2", function(d) { return y(d.upper); })
    .attr("stroke-width", 2);
  *//*
  chart.append("g")
    .attr("class", "rects")
    .selectAll("rect")
    .data(cobj.data)
    .enter().append("rect")
    .attr("x", function(d) { return x(d.lower); })
    .attr("y", function(d) { return y(d[cobj.yvar]); })
    .attr("width", function(d) { return x(d.upper) - x(d.lower); })
    .attr("height", y.rangeBand())
    .style("fill", "#4562e7");//x.rangeRoundBand());
    //.attr("stroke-width", 2);
  */
  
  chart.append("g")
    .attr("class", "lowerBounds")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line.chartLine")
    .attr("y1", function(d) { return y(d[cobj.yvar]); })
    .attr("x1", function(d) { return x(d.lower); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 1*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.lower); });
    
  
  chart.append("g")
    .attr("class", "upperBounds")
    .selectAll("line")
    .data(cobj.data)
    .enter().append("line.chartLine")
    .attr("y1", function(d) { return y(d[cobj.yvar]); })
    .attr("x1", function(d) { return x(d.upper); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 1*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.upper); });
    
  
  gConfInts = chart.append("g")
    .attr("class", "lines");
  
  gConfInts.selectAll("line")
    .data(cobj.data)
    .enter().append("line.chartLine")
    .attr("y1", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("x1", function(d) { return x(d.lower); })
    .attr("y2", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("x2", function(d) { return x(d.upper); });
  
  chart.append("g")
    .attr("class", "circles")
    .selectAll("circle")
    .data(cobj.data)
    .enter().append("circle")
    .attr("cx", function(d) { return x(d[cobj.xvar]); })
    .attr("cy", function(d) { return y(d[cobj.yvar]) + 0.5*y.rangeBand(); })
    .attr("r", 5)
    .style("fill", "#000");
  
  chart.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(cobj.data)
    .enter().append("text")
    .attr("x", function(d) { return x(d['lower']) - 5; })
    .attr("y", function(d) { return y(d[cobj.yvar]) + 0.1*y.rangeBand(); })
    .attr("dy", ".25em")
    .text(function(d) { return d.lower; })
    .style("text-anchor", "end");
  
  chart.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(cobj.data)
    .enter().append("text")
    .attr("x", function(d) { return x(d['upper']) + 5; })
    .attr("y", function(d) { return y(d[cobj.yvar]) + 0.1*y.rangeBand(); })
    .attr("dy", ".25em")
    .text(function(d) { return d.upper; })
    .style("text-anchor", "start");
    
};

updateChart = function(cobj) {
  
  var chart = d3.select(cobj.parent + " svg g");
  
  chart.selectAll("text").remove();
  
};