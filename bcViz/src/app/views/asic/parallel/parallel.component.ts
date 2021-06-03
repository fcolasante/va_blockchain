/* tslint:disable:typedef one-variable-per-declaration no-string-literal */
// noinspection TypeScriptUnresolvedVariable

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

import {Asic} from '../../../models/asic';


@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.scss']
})
export class ParallelComponent implements OnInit, OnChanges {
  @Input() asic: Asic[];
  @Input() color;
  @Output() selectedParallel = new EventEmitter<Asic>();
  private svg;
  private margin = { top: 20, right: 20, bottom: 30, left: 20 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.asic !== undefined) {
      this.drawParallel(this.asic);
    }
  }

  ngOnInit(): void {
     // this.createSvg();
  }

  private createSvg(): void {
    this.svg = d3.select("figure#parallel")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);
  }
  private drawParallel(data: Asic[]) {
    if (data === undefined) { return; }
    if (this.svg) { d3.select("figure#parallel").selectChild().remove(); }

    this.svg = d3.select("figure#parallel")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");


    const dimensions = ['efficiency', 'hashRate', 'profitability', 'power', 'release', 'algo'];
    let y = {};
    y['model'] = d3.scalePoint().domain(data.map(d => d.model).sort()).range([this.height, 0]);
    y['efficiency'] = d3.scaleLinear().domain( d3.extent(data, d => +d['efficiency']) ).range([this.height, 0]);
    y['hashRate'] = d3.scaleLinear().domain( d3.extent(data, d => +d['hashRate']) ).range([this.height, 0]);
    y['profitability'] = d3.scaleLinear().domain( d3.extent(data, d => +d['profitability']) ).range([this.height, 0]);
    y['power'] = d3.scaleLinear().domain( d3.extent(data, d => +d['power']) ).range([this.height, 0]);
    y['release'] = d3.scaleTime().domain( d3.extent(data, d => +d.release) ).range([this.height, 0]);
    y['algo'] = d3.scalePoint().domain(data.map(d => d.algo).sort()).range([this.height, 0]);

    const x = d3.scalePoint()
      .range([0, this.width])
      .padding(1)
      .domain(dimensions);

    function path(d) {
      return d3.line()(dimensions.map(p => [x(p), y[p](d[p])] ));
    }


    this.svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", d => d.enabled ? this.color(d.algo) : 'gray')
      .style("opacity", d => d.enabled ? 0.5 : 0.1)
      .on("mouseover", (event, d) => {
        console.log(d);
        this.selectedParallel.emit(d);
      });

    const brushHeight = 50;
    const brush = d3.brush()
      .extent([[0, 0], [this.width, this.height]])
      .on('start brush end', ({selection}) => {
        console.log(selection);
      });

    const axis = this.svg.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append("g")
      .attr("transform", d => "translate(" + x(d) + ")")
      .each(function(d) {
        d3.select(this).call(d3.axisLeft(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .style("fill", "black")
      .text(d => d);

  }
}
