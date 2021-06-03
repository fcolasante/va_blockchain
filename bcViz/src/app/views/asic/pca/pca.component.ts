import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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

  private svg;
  private margin = { top: 20, right: 10, bottom: 40, left: 40 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.asic) {
      this.drawPlot(this.asic);
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

  }


}
