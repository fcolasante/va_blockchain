// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 20, left: 50},
    width  = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// to read dates properly
var parseDate = d3.timeParse("%Y/%m"),    // "%d/%m/%Y" => DD/MM/YY
    formatDate = d3.timeFormat("%m-%y");

// Parse the Data
d3.csv("stacked_bar_months.csv").then(function(data) {
    data.forEach(function(d) { d.date = parseDate(d.date); });
    console.log(data)

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1)
    console.log(subgroups)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){ return d.date; }).keys()
    console.log(groups)

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.1]);   

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 150000])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis") 
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%y")));
        
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10)

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)(data);

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.date); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());
});