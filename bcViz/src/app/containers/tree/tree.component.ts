/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  private svg;
  private margin = { top: 20, right: 10, bottom: 40, left: 40 };
  private width = 650 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor() { }
  ngOnInit() {
    this.createSvg();
  }

  private createSvg(): void {
    this.svg = d3.select("figure#tree")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append()
  }

}
