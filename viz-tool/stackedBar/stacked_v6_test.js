// d3.timeFormat() in d3.v6
var parseDate = d3.timeParse("%Y/%m"),    // "%d/%m/%Y" => DD/MM/YY
    formatYear = d3.format("02d"),
    formatDate = function(d) { return (d.getMonth()+1) + "/" + formatYear(d.getFullYear() % 100); };

var svg = d3.select("#chart2"),
    margin = {top: 10, right: 20, bottom: 20, left: 20},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y0 = d3.scaleOrdinal([height, 0], .2),
    y1 = d3.scaleLinear(),
    x = d3.scaleOrdinal([0, width], .1, 0);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(formatDate);

var stack = d3.stack()
    .keys(function(d){ return d.values; });

//var color = d3.scale.category10();
var color = d3.scaleOrdinal()
    .domain(["BTC","LTC","XMR","ETH"])
    .range(d3.schemeCategory10[4]);

//var nest = d3.nest()
//    .key(function(d) { return d.group; });
var dataByGroup = d3.nest()
    .key(function(d) { return d.group; })
    .entries(data);

var typeData = function(d) {
        d.date = parseDate(d.date);
        d.value = + d.value;
    };

d3.csv("stacked_bar_months.csv", typeData).then(function(error, data) {

    //data.forEach(function(d) {
    //    d.date = parseDate(d.date);
    //    d.value = + d.value;
    //});

    //var dataByGroup = nest.entries(data);
    //var dataByGroup = d3.nest()
    //    .key(function(d) { return d.group; })
    //    .entries(data);

    stack(dataByGroup);
    x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));
    y0.domain(dataByGroup.map(function(d) { return d.key; }));
    y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);

    var group = svg.selectAll(".group")
        .data(dataByGroup)
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

    group.append("text")
        .attr("class", "group-label")
        .attr("x", -6)
        .attr("y", function(d) { return y1(d.values[0].value / 2); })
        .attr("dy", ".35em")
        .text(function(d) { return d.key; });

    group.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .style("fill", function(d) { return color(d.group); })
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y1(d.value); })
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return y0.rangeBand() - y1(d.value); });

    group.filter(function(d, i) { return !i; }).append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y0.rangeBand() + ")")
        .call(xAxis);

    d3.selectAll("input").on("change", change);

    var timeout = setTimeout(function() {
        d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(timeout);
        if (this.value === "multiples") transitionMultiples();
        else transitionStacked();
    }

    function transitionMultiples() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
        g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
    }

    function transitionStacked() {
        var t = svg.transition().duration(750),
            g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
        g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
    }
});