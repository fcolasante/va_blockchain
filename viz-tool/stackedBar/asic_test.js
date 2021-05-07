// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart-2")
    .append("svg")
        .attr("id", "asic-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../asic/asic.csv").then(function(data) {
    console.log(data);
    // Add X axis
    var x = d3.scaleTime().range([0, width]);

    x.domain(d3.extent(data, function (d) { return d.release}));

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.hashRate}))
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return x(d.release); } )
            .attr("cy", function (d) { return y(d.hashRate); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2");

});