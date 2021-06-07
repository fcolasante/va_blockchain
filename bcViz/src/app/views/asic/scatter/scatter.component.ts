import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import * as d3r from 'd3-regression';
import {Asic} from '../../../models/asic';
import {HashPoint} from '../../../models/HashPoint';
import {A} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements OnInit, OnChanges {
  meanEfficiency: number;
  @Input() asic: Asic[];
  @Input() selectedAsic: Asic;
  @Output() filteredAsicEvent = new EventEmitter<Asic[]>();
  @Input() color;
  private svg;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private width = 700 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private myChange = false;

  ngOnInit(): void {
    this.createSvg();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.asic && changes.asic.previousValue === undefined ) ||
      (changes.asic.previousValue !== undefined &&
      changes.asic.previousValue.length !== changes.asic.currentValue.length)|| this.myChange === false ) {
      console.log("Any", this.asic.find(asic => asic.selParallel));
      this.drawPlot(this.asic);
    }
    if (this.myChange === true) {
      this.myChange = false;
    }
  }
  private createSvg(): void {}

  private drawPlot(data: Asic[]): void {
    console.log("refreshing scatter");
    if (data === undefined) { return; }
    if (this.svg) { d3.select("figure#scatter").selectChild().remove(); }

    this.svg = d3.select("figure#scatter")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    // Add X axis
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => +d.release))
      .range([ 0, this.width ]);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));
    this.svg.append("text")
      .attr('transform', `translate(${this.width / 2 }, ${this.height + this.margin.top + 10 })`)
      .style("text-anchor", "middle")
      .text("Release date");

    this.svg.append("text")
      .attr('transform', `translate(${this.width / 2 }, 0)`)
      .style("text-anchor", "middle")
      .text("Asic Hashrate");
    // Add Y axis
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.hashRate))
      .range([ this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Hashrate [Th]");

    // this.color.domain(d3.extent(data, d => d.profitability));
    // this.buildLegend('#legend1', this.color);
    // Add dots
    const div = this.svg
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 1);

    const dots = this.svg.append('g')
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.release))
      .attr("cy", d => y(d.hashRate))
      .attr("r", d => (d.selParallel) ? 5 : 3)
      .style("stroke-width", 2)
      .style("stroke", d => (d.selParallel) ? "blue" : "trasparent")
      .style("opacity", .5)
      .style("fill", d => this.color(d.algo));
      /**
      .on("mouseover", (event, d) => {
          console.log(event, d);
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div
            .html(`
              <b>${d.model}</b> <br/>
              <b>HashRate:    </b>${d.hashRate}           <i>GH/s</i><br/>
              <b>Efficiency:  </b>${d.efficiency}         <i>j/Gh</i><br/>
              <b>Power:       </b>${d.power}              <i>W</i><br/>
              <b>Profitability:  </b>${d.profitability}   <i>$/day</i><br/>
              <b>Release date: </b>${this.formatTime(d.release)}<i></i>
            `)
            .style('left', event.clientX + 'px')
            .style('top', event.clientY - 28 + 'px');
        });
      **/
    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
      }

    const brush = d3.brush()
      .on('brush', ({selection}) => {
        // console.log(selection);
        const margin = selection[0].map(x.invert, x);
        const filteredAsic = data.filter( asic => isBrushed(selection, x(asic.release), y(asic.hashRate)));
        // .log(filteredAsic);
        dots.classed("selected", asic => isBrushed(selection, x(asic.release), y(asic.hashRate) ));
        const enAsic = data.map( asic => {
            if (isBrushed(selection, x(asic.release), y(asic.hashRate))) {
              return {...asic, enabled: true };
            }else {
              return {... asic, enabled: false};
            }
        });
        // this.asic = filteredAsic;
        this.filteredAsicEvent.emit(enAsic);
        this.myChange = true;
        // console.log(this.asic);
        this.meanEfficiency = d3.mean(filteredAsic, d => d.efficiency);
      });

    this.svg.append("g").attr("class", "brush").call(brush);

    const line = d3.line<Asic>()
      .curve(d3.curveBasis)
      .x((d) => x(d.release))
      .y((d) => y(d.hashRate));


    const regression = d3r.regressionQuad()
      .x(d => x(d.release))
      .y(d => d.hashRate);
    // console.log(regression);
    const res = regression(data);
    const simpleLine = d3.line()
      .x((d) => d[0])
      .y((d) => y(d[1]));

    this.svg.append("path")
      .datum(res)
      .attr("class", "line")
      .attr("d", simpleLine)
      .attr("fill", "none")
      .style("stroke", "blue");


    // Add labels
    /**
    dots.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.model)
      .attr("x", d => x(d.release))
      .attr("y", d => y(d.hashRate));
    const brush = d3.brushX()
      .on('brush', ({selection}) => {
        if (selection){
          console.log(selection);
        }
      });
    **/
  }
  private buildLegend(selector_id, colorscale) {
    const legendheight = 200;
    const legendwidth = 80;
    const margin = {top: 10, right: 60, bottom: 30, left: 2};

    const canvas = d3.select(selector_id)
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "relative")
      .append("canvas")
      .attr("height", legendheight - margin.top - margin.bottom)
      .attr("width", 1)
      .style("height", (legendheight - margin.top - margin.bottom) + "px")
      .style("width", (legendwidth - margin.left - margin.right) + "px")
      .style("border", "1px solid #000")
      .style("position", "absolute")
      .style("top", (margin.top) + "px")
      .style("left", (margin.left) + "px")
      .node();

    const ctx = canvas.getContext("2d");

    const legendscale = d3.scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());

    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    const image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(i => {
      const c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4 * i] = c.r;
      image.data[4 * i + 1] = c.g;
      image.data[4 * i + 2] = c.b;
      image.data[4 * i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
    // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
    /*
    d3.range(legendheight).forEach(function(i) {
      ctx.fillStyle = colorscale(legendscale.invert(i));
      ctx.fillRect(0,i,1,1);
    });
    */

    const legendaxis = d3.axisRight(legendscale)
      .tickSize(6)
      .ticks(8);

    const svg = d3.select(selector_id)
      .append("svg")
      .attr("height", (legendheight) + "px")
      .attr("width", (legendwidth) + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
      .call(legendaxis);
    svg.append("text")
      .attr('transform', `translate(${0 }, ${ legendheight  })`)
      .style("text-anchor", "start")
      .text("Efficiency");
  }

}
