export function drawStacked(data) {

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 20, left: 50},
        width  = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Multi-chart")
        .append("svg")
            .attr("id", "chart2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // to read dates properly
    var parseDate = d3.timeParse("%Y-%m-%d"), // "%Y/%m"), => DD/MM/YY
        formatDate = d3.timeFormat("%y");

    // Parse the Data
    //d3.csv("hashrate_simple.csv").then(function(data) {
    data.forEach(function(d) { d.date = parseDate(d.date); });
    console.log(data)

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1);
    console.log(subgroups);

    // value of the first column "dates" group
    var dates = d3.map(data, function(d){ return d.date; }).keys();  //RABARBARO
    console.log(dates);

    // Create X axis
    var x = d3.scaleBand()
        .domain(dates)
        .range([0, width])
        .padding([0.1]);   

    // Create Y axis
    var y = d3.scaleLinear()
        .domain([0, 300000])
        .range([height, 0]);

    // color palette => one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10)

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)(data);
    
    console.log(stackedData);


    // -----------------------------------
    // Create a tooltip
    // -----------------------------------
    /*var tooltip = d3.select("#chart2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 1)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        tooltip.html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
            .style("opacity", 1);
    };
    // It is important to put the +90: other wise the tooltip is exactly 
    // where the point is an it creates a weird effect
    var mousemove = function(d) {
        tooltip.style("left", (d3.mouse(this)[0]+90) + "px") 
            .style("top", (d3.mouse(this)[1]) + "px");
    };
    var mouseleave = function(d) { tooltip.style("opacity", 0); };*/

    // ----------------------------------------------
    // Show the bars
    // ----------------------------------------------
    svg.append("g")
        // Enter in the stack data = loop key per key = group per group
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .attr("class", "crypto")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.date); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());
                //.on("mouseover", mouseover)
                //.on("mousemove", mousemove)
                //.on("mouseleave", mouseleave);

    // Add x-axis
    svg.append("g")
        .attr("class", "x-axis") 
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(formatDate));
        //.selectAll("text")
        //    .attr("transform", "translate(-10,0)rotate(-45)")
        //    .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
//});

};