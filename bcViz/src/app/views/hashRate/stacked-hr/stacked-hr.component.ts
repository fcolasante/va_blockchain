import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {CryptoHash, HashPoint} from '../../../models/HashPoint';
import {Asic} from '../../../models/asic';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-stacked-hr',
  templateUrl: './stacked-hr.component.html',
  styleUrls: ['./stacked-hr.component.scss']
})
export class StackedHRComponent implements OnInit , OnChanges{
  @Input() rawData;
  @Input() filterCrypto;
  @Input() allHashRate: CryptoHash[];
  @Input() color;
  @Input() x;

  private margin = { top: 30, right: 20, bottom: 30, left: 50 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private parseTime = d3.timeParse("%Y-%m-%d");
  private y;
  private svg;
  private g;

  constructor() { }
  ngOnInit(): void {
    this.createSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.rawData !== undefined && this.filterCrypto !== undefined) {
      this.drawChart();
    }
  }

  private createSvg(): void {

    this.svg = d3.select("figure#stacked")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  }

  private drawChart(): void {
    console.log("HR drawing", this.rawData, this.filterCrypto);
    this.y = d3.scaleLinear().range([this.height, 0]).domain( [0, 1]);

    this.g.selectAll("*").remove();
    this.g.append("text")
      .attr('transform', `translate(${this.width / 2 + 5}, 0)`)
      .style("text-anchor", "middle")
      .text("Cryptocurrency hashrate proportion");

    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x).ticks(10));

    this.g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left - 2 )
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Proportion [%]");


    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(this.y).ticks(10)
      );

    let series = d3.stack()
      .keys(Object.keys(this.filterCrypto).filter( key => this.filterCrypto[key]))
      .offset(d3.stackOffsetExpand)(this.rawData);

    series = series.filter( (d, i) => i < 10);
    const area = d3.area()
      .x((d: any) => {
        return this.x(this.parseTime(d.data.date));
      })
      .y0(d => this.y(d[0]))
      .y1(d => this.y(d[1]));

    this.g.append("g")
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("fill", (d) => this.color(d.key))
      .attr("d", area)
      .append("title")
      .text(({key}) => key);

  }

}
