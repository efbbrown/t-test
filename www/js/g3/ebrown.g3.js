/*

    ebrown.g3.js
    v1, 20151115
 
    shortcut binds to g3
    
*/

g3 = {};

var ebrown = ebrown || {};
ebrown.g3 = g3;

// check whether options[arg] is defined. If it isn't, assign to it the value def.
g3.checkUndefined = function(arg, def, options) {
  if (options[arg] === null || options[arg] === undefined) {
    return def;
  } else {
    return options[arg];
  }
}

// Return clientWidth of element
g3.elementWidth = function(element) {
  return element[0][0].clientWidth;
}

// Return clientHeight of element
g3.elementHeight = function(element) {
  return element[0][0].clientHeight;
}

// Create and return margins
// options = {height, width, marginsize}
g3.marginObject = function(options) {
  
  var parentHeight = g3.checkUndefined("height", 300, options),
      parentWidth = g3.checkUndefined("width", 300, options),
      marginsize = g3.checkUndefined("marginsize", 300, options);
  
  return {top: parentHeight * marginsize,
          right: parentWidth * marginsize,
          bottom: parentHeight * marginsize,
          left: parentWidth * marginsize};
}

// Calculate and return chart length. Used for both chart width and chart height.
g3.chartLength = function(parentLength, marginOne, marginTwo) {
  return parentLength - marginOne - marginTwo;
}

// Append and return a svg with g element
g3.appendChart = function(parentDiv, parentWidth, parentHeight, margin) {
  
  return parentDiv.append("svg")
    .attr("width", parentWidth)
    .attr("height", parentHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
}

/*----------------Scales--------------*/

// Create a d3 linear scale
// options = {min, max}
g3.linearScale = function(options) {
  
  var min = g3.checkUndefined("min", 0, options),
      max = g3.checkUndefined("max", undefined, options);
  
  if (options.min === null || options.min === undefined) {
    min = 0;
  }
  if (options.max === null || options.max === undefined) {
    max = 0;
  }
  
  return d3.scale.linear().range([min, max]);
  
}

// Create an ordinal scale with space in between ords (bars?)
g3.ordinalScale = function(options) {
  
  var min = g3.checkUndefined("min", 0, options),
      max = g3.checkUndefined("max", undefined, options),
      space = g3.checkUndefined("space", 0.3, options);
  
  var result = d3.scale.ordinal().rangeRoundBands([min, max], space);
  
  return result;
  
}

// options = {type, min, max, space}
g3.scale = function(options) {
  
  var type = g3.checkUndefined("type", "linear", options),
      min = g3.checkUndefined("min", 0, options),
      max = g3.checkUndefined("max", 100, options),
      space = g3.checkUndefined("space", 0.3, options);
      
  if (options.geom === "bar") {
    type = "ordinal";
  }
  
  if (type === "linear") {
    return(g3.linearScale(options));
  } else if (type === "ordinal") {
    return(g3.ordinalScale(options));
  }
  
}

/*----------------Titles and Axes--------------*/

g3.createTitle = function(chart, title, width, margin) {
    // Add title if given
  if (title === null || title === "undefined") {
    
  } else {
    chart.append("text")
      .attr("x", (width/2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "1em")
      .text(title);
  }
}

g3.labelx = function(chart, xlab, width, height, margin) {
  // Add x label if given
  if (xlab === null || xlab === "undefined") {
    
  } else {
    chart.append("text")
      .attr("x", (width/2))
      .attr("y", height + (margin.bottom * (3/4)))
      .attr("dx", "1em")
      .attr("text-anchor", "middle")
      //.style("font-size", "1em")
      .text(xlab);
  }
}

g3.labely = function(chart, ylab, height, margin) {
    // Add y label if given
  if (ylab === null || ylab === "undefined") {
    
  } else {
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (0 - (height/2)))
      .attr("y", 0 - (margin.left))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      //.style("font-size", "1em")
      .text(ylab);
  }
}

// options = {scale, orient, ticks}
g3.axis = function(options) {
  
  var dimension = options.dimension;
  
  if (dimension === "x") {
    var orient = g3.checkUndefined("orient", "bottom", options);
  } else if (dimension === "y") {
    var orient = g3.checkUndefined("orient", "left", options);
  }
  
  var ticks = g3.checkUndefined("ticks", undefined, options),
      scale = g3.checkUndefined("scale", undefined, options);

  var axis = d3.svg.axis()
      .scale(scale)
      .orient(orient);
  
  if (ticks === undefined) {
    
  } else {
    axis = axis.ticks(ticks);
  }
  
  return(axis);
  
}

/*------------------------------*/

// From Rikky rwcohn.paint.js
g3.hsl2rgb = function(h, s, l) {
  var m1, m2, hue;
  var r, g, b;
  s /= 100;
  l /= 100;
  h -= Math.floor(h / 360) * 360;
  if (s == 0)
  {
      r = g = b = (l * 255);
  }
  else
  {
      if (l <= 0.5)
          m2 = l * (s + 1);
      else
          m2 = l + s - l * s;
      m1 = l * 2 - m2;
      hue = h / 360;
      r = HueToRgb(m1, m2, hue + 1/3);
      g = HueToRgb(m1, m2, hue);
      b = HueToRgb(m1, m2, hue - 1/3);
  }
  return [r, g, b];
}

// Will accept styles 'fill' or 'stroke'
g3.addStyle = function(parent, style, idclass, colour) {
  // Fill points if colour is given.
  if (colour === null || colour === "undefined") {
    var pointsfill = d3.selectAll(parent + " ." + idclass)
                          .style(style, "#444");
  } else {
    var pointsfill = d3.selectAll(parent + " ." + idclass)
                          .style(style, colour);
  }
}

/*----------------Layers--------------*/

// options = {geom, chart, idclass, data, xscale, yscale, xvar, yvar, radius, height}
g3.plotLayer = function(chart, g3plot, layer) {
  
  var options = g3plot.layer[layer],
      panel = g3plot.panel;
  
  var geom = options.geom || undefined,
      shape = options.shape,
      idclass = options.idclass,
      data = options.data,
      xscale = options.xscale,
      yscale = options.yscale,
      xvar = options.xvar,
      yvar = options.yvar,
      radius = options.radius || 2,
      height = options.height;
  
  if (geom === "point") {
    chart.selectAll("." + idclass)
      .data(data)
      .enter().append(shape)
      .attr("class", idclass)
      .attr("cx", function(d) { return xscale(d[xvar]); })
      .attr("cy", function(d) { return yscale(d[yvar]); })
      .attr("r", radius);
  } else if (geom === "bar") {
    chart.selectAll("." + idclass)
      .data(data)
      .enter().append(shape)
      .attr("class", idclass)
      .attr("x", function(d) { return xscale(d[xvar]); })
      .attr("width", xscale.rangeBand())
      .attr("y", function(d) { return yscale(d[yvar]); })
      .attr("height", function(d) { return panel.chartHeight - yscale(d[yvar]); });
  }
  
}

// options = {geom, chart, idclass, data, xscale, yscale, xvar, yvar, radius, height}
g3.addLayer = function(tree, options) {
  
  var layerArray = tree.layer;
  
  var layer = {
    geom: options.geom || undefined,
    idclass: options.idclass || "",
    data: options.data || tree.base.data,
    xscale: options.xscale || tree.base.xscale,
    yscale: options.yscale || tree.base.yscale,
    xvar: options.xvar || tree.base.xvar
  };
  
  layerArray.push(layer);
  
  return(tree);
  
}

/*----------------Make Tree--------------*/

// options = {par, data, xvar, yvar, title, xlab, ylab, colour, marginsize}
// formats the options into a plot list to be given to g3.plotList
g3.makeList = function(options) {
  
  var g3plot = {
    base: {},
    panel: {},
    layer: []
  };
  
  g3plot.base = {
    par: options.par || undefined,
    data: options.data || undefined,
    xvar: options.xvar || undefined,
    yvar: options.yvar || undefined,
    xscale: options.xscale || undefined,
    yscale: options.ysale || undefined,
    colour: options.colour || undefined,
  };
  
  g3plot.panel = {
    title: options.title || undefined,
    xlab: options.xlab || undefined,
    ylab: options.ylab || undefined,
    marginsize: options.marginsize || undefined
  }

  return(g3plot);
  
};

/*----------------Plots--------------*/

// Implement g3.plot from the output tree of makeList
g3.plotList = function(options) {
  
  // Create a g3plot object from the given options
  var g3plot = g3.makeList(options);
  
  console.log(g3plot);
  
  // The margin defaults to 10% of the parent width & parent height
  var marginsize = g3plot.panel.marginsize || 0.1;
  
  // The parent html element of the chart
  var parentDiv = d3.select(g3plot.base.par);

  // Width and Height of the parent html element
  var parentWidth = g3.elementWidth(parentDiv),
      parentHeight = g3.elementHeight(parentDiv);
      
  // Make sure this is height then width !!!
  var margin = g3.marginObject(parentHeight, parentWidth, marginsize);

  // Chart width and height, dependent on parentDiv and marginsize 
  var width = g3.chartLength(parentWidth, margin.left, margin.right),
      height = g3.chartLength(parentHeight, margin.top, margin.bottom);

  // Add chart svg to parentDiv
  var chart = g3.appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  // 
  var x = g3.scale({type: "linear", min: 0, max: width});
  var y = g3.scale({type: "linear", min: height, max: 0});
  
  var xAxis = g3.axis(x, "bottom", 2);
  var yAxis = g3.axis(y, "left", 8);
  
  var data = g3.checkUndefined("data", undefined, g3plot.base),
      xvar = g3.checkUndefined("xvar", undefined, g3plot.base),
      yvar = g3.checkUndefined("yvar", undefined, g3plot.base);
  
  x.domain(d3.extent(data, function(d) { return d[xvar]; }));
  y.domain(d3.extent(data, function(d) { return d[yvar]; }));

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  
}

g3.plotTree = function(g3plot) {
  
  var p = g3plot,
      base = g3plot.base,
      panel = g3plot.panel;
  
  // The margin defaults to 10% of the parent width & parent height
  var marginsize = panel.marginsize || 0.1;
  
  // The parent html element of the chart
  var parentDiv = d3.select(base.par);

  // Width and Height of the parent html element
  var parentWidth = g3.elementWidth(parentDiv),
      parentHeight = g3.elementHeight(parentDiv);
      
  // Make sure this is height then width !!!
  var margin = g3.marginObject({height: parentHeight, width: parentWidth, marginsize: marginsize});

  // Chart width and height, dependent on parentDiv and marginsize 
  var width = g3.chartLength(parentWidth, margin.left, margin.right),
      height = g3.chartLength(parentHeight, margin.top, margin.bottom);
      
  panel.chartWidth = width;
  panel.chartHeight = height;

  // Add chart svg to parentDiv
  var chart = g3.appendChart(parentDiv, parentWidth, parentHeight, margin);
  
  if (g3plot.layer[0]["geom"] === "point") {
    // These are scales. Linear scales.
    var x = g3.scale({type: "linear", min: 0, max: width}),
        y = g3.scale({type: "linear", min: height, max: 0});
  } else if (g3plot.layer[0]["geom"] === "bar") {
    // These are scales. Linear scales.
    var x = g3.scale({type: "ordinal", min: 0, max: width}),
        y = g3.scale({type: "linear", min: height, max: 0});
  }
  
  // These are scales. Linear scales.
  //var x = g3.scale({type: "linear", min: 0, max: width}),
  //    y = g3.scale({type: "linear", min: height, max: 0});
  
  base.xscale = x;
  base.yscale = y;
  
  var xAxis = g3.axis({dimension: "x", scale: x, orient: "bottom"}),
      yAxis = g3.axis({dimension: "y", scale: y, orient: "left"});
  
  base.xAxis = xAxis;
  base.yAxis = yAxis;
                
  var data = g3.checkUndefined("data", undefined, g3plot.base),
      xvar = g3.checkUndefined("xvar", undefined, g3plot.base),
      yvar = g3.checkUndefined("yvar", undefined, g3plot.base);
  
  x.domain(d3.extent(data, function(d) { return d[xvar]; }));
  y.domain(d3.extent(data, function(d) { return d[yvar]; }));
  
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + panel.chartHeight + ")")
      .call(base.xAxis);
  
  chart.append("g")
      .attr("class", "y axis")
      .call(base.yAxis);
      
  var layer0 = g3plot.layer[0];
  
  var layerOptions = ["geom", "shape", "idclass", "data", "xvar", "yvar", "xscale", "yscale", "radius",
                      "width", "height"];
  
  var option = "";
  
  for (op = 0; op < layerOptions.length; op ++) {
    option = layerOptions[op];
    layer0[option] = g3.checkUndefined(option, base[option], layer0);
  }
  
  if (layer0["geom"] === "point") {
    layer0["shape"] = "circle";
  } else if (layer0["geom"] === "bar") {
    layer0["shape"] = "rect";
    layer0["xscale"] = g3.scale({type: "ordinal", min: 0, max: panel.chartWidth, space: .2})
  }
  
  g3.plotLayer(chart, g3plot, 0);
  
  //g3.layer(geom = geom, chart = chart, idclass = idclass, data = data,
  //         xscale = x, yscale = y, xvar = xvar, yvar = yvar);//, radius = 2);
      
  g3.addStyle(g3plot.base.par, "fill", layer0.idclass, g3plot.base.colour);
  
  g3.createTitle(chart, g3plot.panel.title, width, margin);
  
  g3.labelx(chart, g3plot.panel.xlab, width, height, margin);
  
  g3.labely(chart, g3plot.panelylab, height, margin);
  
  return(g3plot);
  
}
