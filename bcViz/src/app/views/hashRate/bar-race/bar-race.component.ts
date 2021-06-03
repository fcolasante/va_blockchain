import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-bar-race',
  templateUrl: './bar-race.component.html',
  styleUrls: ['./bar-race.component.scss']
})
export class BarRaceComponent implements OnInit {
  private margin = { top: 20, right: 80, bottom: 30, left: 60 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private svg;
  private g;

  private tickDuration = 500;

  private top_n = 12;
  private height = 600;
  private width = 960;

  constructor() { }

  ngOnInit(): void {
  }
  private createSvg(): void {

    this.svg = d3.select("figure#race")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }
  private drawChart(): void {
    const barPadding = (this.height - (this.margin.bottom + this.margin.top)) / ( this.top_n * 5 );

    const title = this.svg.append('text')
      .attr('class', 'title')
      .attr('y', 24)
      .html('18 years of Interbrand’s Top Global Brands');

    const subTitle = this.svg.append("text")
      .attr("class", "subTitle")
      .attr("y", 55)
      .html("Brand value, $m");

    const caption = this.svg.append('text')
      .attr('class', 'caption')
      .attr('x', this.width)
      .attr('y', this.height - 5)
      .style('text-anchor', 'end')
      .html('Source: Interbrand');

    const year = 2000;
  }

}
