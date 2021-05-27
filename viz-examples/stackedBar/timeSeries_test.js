/*-------------------------------------------------------------------------------------------------------------------------
g elemenet is appended to svg which used to group SVG shapes together and translated as needed.
------------------------------------------------------------------------------------------------------------------------ */
var svg = d3.select("#chart-series"),
    margin = { top: 20, right: 80, bottom: 30, left: 80 },
    width = 960 - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });


function gridXaxis(){
    return d3.axisBottom(x).ticks(5)
}

function gridYAxis() {
    return d3.axisLeft(y).ticks(5)
}

var filterData = {
    "BTC":false, 
    "ETH,": false,
    "LTC,": false,
    "XMR,": false,
    "BCH,": false,
    "BSV,": false,
    "DASH": false,
    "DOGE": false,
    "ETC,": false,
    "VTC,": false,
    "ZEC":  false
};
/*------------------------------------------------------------------------------------------------------------------------
The drawchart function is called through the redraw function defined later. This is called on the onlclick events of the legends.
BAsed on the the legends selected, the filtereddata is updata and accordingly the data is displayed.
Load the BRICSdata.csv. We pass the data of the file to the function type to convert :
{
Brazil: "42.52264625"
China: "35.6471922"
India: "16.54654149"
Russia: "167.5039675"
South Africa: "96.15287984"
United States: "319.47567"
date: "2000"
}

to 
{
Brazil: 42.52264625
China: 35.6471922
India: 16.54654149
Russia: 167.5039675
South Africa: 96.15287984
United States: 319.47567
date: Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time) {}
}

Then we store the values as:
{
id: "Brazil",
values: 
    {
        date: Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time),
        usage: 42.52264625
    }
}, and so on for other countries.
------------------------------------------------------------------------------------------------------------------------*/ 

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

        x.domain(d3.extent(data, function (d) { return d.date; }));

        y.domain([
            d3.min(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.min(c.values, function (d) { return d.price; }); }),
            d3.max(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.max(c.values, function (d) { return d.price; }); })
        ]);

        z.domain(newcountries.map(function (c) { return c.id; }));

/*-------------------------------------------------------------------------------------------------------------------------
The below code is used to create a legend for all the BRICS countries and use them as a filter. For each country a rectangle is filled with the corresponding color and the text / name of the country is displayed next to it.
-------------------------------------------------------------------------------------------------------------------------*/
        g.selectAll("*").remove();
        var legend = g.selectAll('g')
            .data(newcountries)
            .enter()
            .append('g')
            .attr('class', 'legend');

         
        legend.append("rect")
            .attr('x', width + 100)
            .attr('y', function (d, i) { return i * 20; })
            .attr('width', 10)
            .attr('height', 10)

            .style('fill', function (d) {
                console.log(d.id);
                if (filterData[d.id] == true) {
                    return z(d.id);
                }
            })
            .style("stroke", function (d) {
                return z(d.id);
            });

  
        legend.append('text')
            .attr('x', width + 48)
            .attr('y', margin.top - 30)
            .attr("transform", "translate(10," + 3 + ")")
            .text("Crypto legend")
            .style("font", "15px sans-serif");
  
        legend.append('text')
            .attr('x', width + 108)
            .attr('y', function (d, i) { return (i * 20) + 9; })
            .attr("transform", "translate(10," + 3 + ")")
            .text(function (d) { return d.id; });
        
         
        legend.on("click", function (d) {
                reDraw(d.id);
            });

/*-------------------------------------------------------------------------------------------------------------------------
Below commands are used to create the x and y axis and have the text "Million BTUs Per Person " for y axis by rotating at -90 degrees.
-------------------------------------------------------------------------------------------------------------------------*/ 

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
                .attr("x", 875)
                .attr("dx", "0.71em")
                .attr("fill", "#000")
                .text("Year");

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(5))
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("x", -175)
                .attr("dy", "-4.5em")
                .attr("fill", "#000")
                .text("Million BTUs Per Person");
  
        g.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(gridXaxis()
                .tickSize(-height)
                .tickFormat(""))

        // add the Y gridlines
        g.append("g")
            .attr("class", "grid")
            .call(gridYAxis()
                .tickSize(-width)
                .tickFormat("")
            );
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code treis to find tags with class country and if it doesnt find, it appends a g with class country. Using the countries data mentioned before,
the values for countries are provided to the line() =>
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.usage); }); 
    which is defined above.
This approximates the values and prolts the curve using curveBasis and the color is the one which we had set above in function z. So we pass the values for country name and color the line accordingly based on the value returned by the function.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
 

        var country = g.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .enter().append("g")
            .attr("class", "country");

        country.append("path")
            .attr("class", "line")

            .attr("d", function (d) { return line(d.values); })
            .style("stroke", function (d) { return z(d.id); });
        svg.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .exit()
            .remove();

        var totalLength = width + width;


        /*country
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3000)
            .ease(d3.easeLinear)

            .attr("stroke-dashoffset", 0);
            */

        country.append("text")
            .datum(function (d) { return { id: d.id, value: d.values[d.values.length - 1] }; })
            .attr("transform", function (d) { return "translate(" + x(d.value.date) + "," + y(d.value.price) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function (d) { return d.id; })
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below helps to provide a title to the visualization
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 

        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2) + 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style('fill', "#1A719C")
            .text("Network hashrate");

       
        var mouseG = g.append("g")
            .attr("class", "mouse-over-effects");
       
        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0")

        var lines = document.getElementsByClassName('line');
       
   
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .enter()
            .append("g")
            .attr("class", "mouse-per-line")
            ;

        
        mousePerLine.append("circle")
            .attr("r", 4)
            .style("stroke", function (d) {

                return z(d.id);

            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0")

        mousePerLine.append("text")
            .attr("transform", "translate(10,-4)");


        mouseG.append('svg:rect') 
            .attr('width', width + margin.left - 50) 
            .attr('height', height + margin.top + margin.bottom)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function () { 
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mouseover', function () { 
                d3.select(".mouse-line")
                    .style("opacity", "1")
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1")
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1")
            })

  
            .on('mousemove', function () { 
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + (mouse[0]) + "," + (height);
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });
            
/*----------------------------------------------------------------------------------------------------------------------------------------------
For the path of circle and values to be displayed through the path, we get lenght of the path, get the x and y coords of the path and plot the circle accoordingly.
Incase the mouse is out of the canvas then the loop break. Basically it helps to display the value which is shown by the circle.
The value for text is displayed upto 2 decimals.

-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
            
            
                d3.selectAll(".mouse-per-line")
                    .style("font-size", "14px")
                    .attr("transform", function (d, i) {
                        //console.log(width / mouse[0])
                       /* var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function (d) { return d.date; }).right;
                        idx = bisect(d.values, xDate);*/
                        var beginning = 0,
                            end = lines[i].getTotalLength(),
                            target = null;

                        while (true) {
                            target = Math.floor((beginning + end) / 2);
                            pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0]) end = target;
                            else if (pos.x < mouse[0]) beginning = target;
                            else break; //position found
                        }

                        d3.select(this).select('text')
                            .text(y.invert(pos.y).toFixed(2));

                        return "translate(" + (mouse[0]) + "," + (pos.y) + ")";
                    });
            });

        svg.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .exit()
            .remove();


    })
}

function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}
console.log(filterData);
drawChart(filterData);
            
   
function reDraw(id) {

    filterData[id] = !filterData[id];
    console.log("redraw :");
    console.log(filterData);
    drawChart(filterData);
}


