// export function drawStacked(data) {

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 35, left: 60},
    width  = 660 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart-2")
    .append("svg")
        .attr("id", "stacked-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// to read dates properly:
//   format with "%Y/%m" if using 'stacked_bar_months.csv', 
//   with "%Y-%m-%d" if using '../multiSeries/hashrate_simple.csv'
var parseDate = d3.timeParse("%Y/%m"),   
    formatDate = d3.timeFormat("%m-%y");


// Parse the Data ../multiSeries/hashrate_simple.csv
d3.csv("./stacked_bar_months.csv").then(function(data) {
    data.forEach(function(d) { d.date = parseDate(d.date); });
    console.log(data)

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1);
    console.log(subgroups);

    // value of the first column "dates" group
    var dates = d3.map(data, function(d) { return d.date; });
    console.log(dates);

    // Create X axis
    var x = d3.scaleBand()
        .domain(dates)
        .range([0, width]);
        //.padding([0.1]);   

    function gridXaxis(){
        return d3.axisBottom(x).ticks(5)
    }

    // Create Y axis
    var y = d3.scaleLinear()
        .domain([0, 200000])      // too low if all crypto are selected
        .range([height, 0]);

    var y0 = d3.scaleLinear();

    // Add x-axis
    svg.append("g")
        //.attr("class", "x-axis") 
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(formatDate))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        //.attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // color palette => one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10)

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        .order(d3.stackOrderNone)
        (data);

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


    // ----------------------------------------------
    // Handle transitions
    // ----------------------------------------------
    /*d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
        d3.select("input[value=\"stacked\"]")
            .property("checked", true)
            .each(change);
    }, 2000);

    function change() {
        clearTimeout(timeout);
        if (this.value === "multiples") transitionMultiples();
        else transitionStacked();
    }

    // TO check this transitions
    function transitionMultiples() {
        var t = svg.transition().duration(750);
        var g = t.selectAll(".group")
            .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; })
            .selectAll("rect")
                .attr("y", function(d) { return y(d.value); })
                .select(".group-label")
                    .attr("y", function(d) { return y(d.values[0].value / 2); });
    };

    function transitionStacked() {
        var t = svg.transition().duration(750);
        var g = t.selectAll(".group")
            .attr("transform", "translate(0," + y0(y0.domain()[0]) + ")")
            .selectAll("rect")
                .attr("y", function(d) { return y(d.value + d.valueOffset); })
                .select(".group-label")
                    .attr("y", function(d) { return y(d.values[0].value / 2 + d.values[0].valueOffset); });
    }; */

});

//};


function drawChart(filterData) {
    d3.csv("../multiSeries/hashrate_simple.csv", type).then(function (data) {
        console.log(data);

        var countries = data.columns.slice(1).map(function (id) {
            return {
                id: id,
                values: data.map(function (d) {
                    return { date: d.date, price: d[id] };
                })
            };
        });
        console.log(countries);
               
        var newcountries = countries;
        countries = countries.filter(function (d) { return filterData[d.id] == true });
    
    }); 

};