import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Asic} from '../../../models/asic';
import * as d3 from 'd3';
import {DiscreteLegend} from "d3-color-legend";

@Component({
  selector: 'app-pca',
  templateUrl: './pca.component.html',
  styleUrls: ['./pca.component.scss']
})
export class PcaComponent implements OnInit, OnChanges {
  @Input() asic: Asic[];
  @Input() color;
  @Output() filteredAsicEvent = new EventEmitter<Asic[]>();
  private myChange = false;

  private svg;
  private margin = { top: 20, right: 10, bottom: 30, left: 40 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 350 - this.margin.top - this.margin.bottom;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.asic && !this.myChange) {
      this.drawPlot(this.asic);
    }
    if (this.myChange){
      this.myChange = false;
    }
  }

  ngOnInit(): void {
    this.createSvg();
  }
  private createSvg(): void {
    this.svg = d3.select("figure#pca")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


  }
  private drawPlot(data: Asic[]): void {
    if (data === undefined) { return; }
    // Add X axis
    if (this.svg) { this.svg.selectAll("*").remove(); }
    this.svg.append("text")
      .attr('transform', `translate(${this.width / 2 }, 0)`)
      .style("text-anchor", "middle")
      .text("PCA");

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => +d.pca_X))
      .range([ 0, this.width ]);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    this.svg.append("text")
      .attr('transform', `translate(${this.width / 2 }, ${this.height + this.margin.bottom  })`)
      .style("text-anchor", "middle")
      .text("Principal component 2");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.pca_Y))
      .range([ this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Principal component 1");

    const dots = this.svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.pca_X))
      .attr("cy", d => y(d.pca_Y))
      .attr("r", 3)
      .style("opacity", d => d.enabled ? 0.5 : 0.1)
      .style("fill", d => d.enabled ? this.color(d.algo) : 'gray');

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
        const filteredAsic = data.filter( asic => isBrushed(selection, x(asic.pca_X), y(asic.pca_Y)));
        // .log(filteredAsic);
        dots.classed("selected", asic => isBrushed(selection, x(asic.pca_X), y(asic.pca_Y) ));
        const enAsic = data.map( asic => {
          if (isBrushed(selection, x(asic.pca_X), y(asic.pca_Y))) {
            return {...asic, selParallel: true };
          }else {
            return {... asic, selParallel: false};
          }
        });
        // this.asic = filteredAsic;
        this.filteredAsicEvent.emit(enAsic);
        this.myChange = true;
      });
    this.svg.append("g").attr("class", "brush").call(brush);

  }


}
