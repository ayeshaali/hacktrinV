
/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web" 
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html   
		
Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */

		
//Width and height of map
var width = 960;
var height = 500;

//year of map
var year = 1789;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(193,213,231)", "rgb(213,222,217)", "rgb(145, 216, 209)", "rgb(69,173,168)"]);

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
        .attr("class", "map")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

function update(year) {
// Load in my states data!
d3.csv("https://raw.githubusercontent.com/ayeshaali/hacktrinV/master/stateslived.csv", function(data) {
color.domain([0,1,2,2018]); // setting the range of the input data
console.log(data);

// Load GeoJSON data and merge with states data
d3.json("https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {


  // Grab State Name
  var dataState = data[i].state;

  // Grab State date 
  var dataValue = data[i].year;

  // Grab State territory
  var dataTerritory = data[i].territory;
  console.log(dataTerritory);

  // Find the corresponding state inside the GeoJSON
  for (var j = 0; j < json.features.length; j++)  {
    var jsonState = json.features[j].properties.name;

    if (dataState == jsonState) {

      // Copy the data value into the JSON
      json.features[j].properties.year = dataValue;
      json.features[j].properties.territory = dataTerritory; 

      // Stop looking through the JSON
      break;
    }
  }
}
		
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {
    var value = d.properties.year;
    var territory = d.properties.territory;
    if (value<=year) {
      return "rgb(69,173,168)";
      //return color(value);
    } else if(territory<=year){
      return "rgb(145, 216, 209)";
    } else { 
      return "rgb(213,222,217)";
    }
  })
  .on("mouseover", function(d) {   
    div.transition()    
    .duration(200)    
    .style("opacity", .9);    

    div.html(d.properties.state+ "<br/>"+ d.properties.year )  
    .style("left", (d3.event.pageX) + "px")   
    .style("top", (d3.event.pageY - 28) + "px");  
  })          
  .on("mouseout", function(d) {   
    div.transition()    
    .duration(500)    
    .style("opacity", 0); 
  });

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legendText = ["Current States","Territories", "Non-states",year];
var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});
});
}

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
        //console.log(this.value);
        year=this.value;
        svg.selectAll("*").remove();
        $('.legend').remove();
        update(year);
  }