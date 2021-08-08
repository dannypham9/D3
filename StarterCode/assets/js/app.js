// @TODO: YOUR CODE HERE!

var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper// 
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data //
d3.csv("assets/data/data.csv")
  .then(function(healthData) {
  	console.log()
    
    // Parse Data//
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
    // Scale Functions //
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Axis Functions //
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Circles //
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "navy")
    .attr("opacity", "0.8");

     var abbrGroup = chartGroup.selectAll("label")
    .data(healthData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size",10)
    .attr("font-weight","bold")
    .attr("fill", "white")
    .attr("x", d => xLinearScale(d.poverty)-8)
    .attr("y", d => yLinearScale(d.healthcare)+5);
    
   
    // Tool Tips //
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>In Poverty: ${d.poverty}%<br>No Healthcare: ${d.healthcare}%`);
      });

    // Append Tooltip to Chart // 
    chartGroup.call(toolTip);

    // Display and Hide Tooltip//
   abbrGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event //
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Axes labels //
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });