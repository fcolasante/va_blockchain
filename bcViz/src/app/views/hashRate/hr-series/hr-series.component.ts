import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {CryptoHash, HashPoint} from '../../../models/HashPoint';
import {Asic} from '../../../models/asic';
import {MatTableDataSource} from '@angular/material/table';
import {Cryptocurrecy} from '../../../containers/hash-rate/hash-rate.component';

@Component({
  selector: 'app-hr-series',
  templateUrl: './hr-series.component.html',
  styleUrls: ['./hr-series.component.scss']
})
export class HrSeriesComponent implements OnInit, OnChanges {
  @Input() originalSeries: any[];
  @Input() cryptos: Cryptocurrecy[];
  filterCrypto = { "BTC":false,
    "ETH": true,
    "LTC": true,
    "XMR": false,
    "BCH": false,
    "BSV": false,
    "DASH": false,
    "DOGE": false,
    "ETC": false,
    "VTC": false,
    "ZEC":  false
  };

  @Input() data: any;
  @Input() color;
  @Output() newFilteredCrypto = new EventEmitter();

  private marginDate;
  private svg;
  private g;
  x;
  private y;
  private line;

  private margin = { top: 20, right: 90, bottom: 30, left: 60 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;


  private parseTime = d3.timeParse("%Y-%m-%d");
  @Input() allHashRate: CryptoHash[];
  hashRate: CryptoHash[];

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allHashRate) {
      this.drawChart(this.filterCrypto);
    }
  }

  private createSvg(): void {
    this.svg = d3.select("figure#hr")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 )
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Hashrate [Th] ");


    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLog().range([this.height, 0]);
    this.line = d3.line<HashPoint>()
      .curve(d3.curveBasis)
      .x((d) => this.x(d.date))
      .y((d) => this.y(d.hashRate !== null ? d.hashRate : 1));
    const gridXaxis = () => d3.axisBottom(this.x);

    const gridYAxis = () => d3.axisLeft(this.y);
  }

  private drawChart(filterData): void {
    if (this.allHashRate === undefined) { return; }
    console.log(this.allHashRate);


    this.hashRate = this.allHashRate.filter( d => this.filterCrypto[d.id]);
    if (this.marginDate !== undefined) {
      this.hashRate = this.hashRate.map( hr => ({...hr, values: hr.values.filter(v => v.date > this.marginDate[0] && v.date < this.marginDate[1])}));
    }
    this.x.domain([
      d3.min(this.hashRate.filter(d => this.filterCrypto[d.id]), c => d3.min(c.values, d => d.date)),
      d3.max(this.hashRate.filter(d => this.filterCrypto[d.id]), c => d3.max(c.values, d => d.date))
    ]);
    this.y.domain([
        d3.min(this.hashRate.filter(d => this.filterCrypto[d.id]), c => d3.min(c.values, d => d.hashRate)),
        d3.max(this.hashRate.filter(d => this.filterCrypto[d.id]), c => d3.max(c.values, d => d.hashRate))
  ]);
    this.color.domain(this.allHashRate.map(c => c.id));

    this.g.selectAll("*").remove();
    this.drawLegend();
    this.g.append("text")
      .attr('transform', `translate(${this.width / 2 }, 0)`)
      .style("text-anchor", "middle")
      .text("Cryptocurrency hashrate");

    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x).ticks(15));

    const clip = this.g.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", this.width )
      .attr("height", this.height )
      .attr("x", 0)
      .attr("y", 0);
    // Add brushing
    const brush = d3.brushX()
      .extent( [ [0, 0], [this.width, this.height] ] )
      .on("end", ({selection}, d) => {
        console.log(selection);
        const margin = selection.map(this.x.invert, this.x);
        this.marginDate = margin;
        this.drawChart(this.filterCrypto);
      });

    // Create the line variable: where both the line and the brush take place
    const line = this.g.append('g')
      .attr("clip-path", "url(#clip)");


    function toTH(x: number, index: number): string {
      console.log("TH", x);
      return (x / Math.pow(10, 12 )) + " Th";
    }

    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(this.y));
    // .tickFormat(toTH)
    const country = this.g.selectAll(".country")
      .data(this.hashRate.filter(d => filterData[d.id] === true))
      .enter().append("g")
      .attr("class", "country");

    country.append("path")
      .attr("class", "line")
      .attr("d", d => this.line(d.values))
      .attr("fill", "none")
      .style("stroke", d => this.color(d.id));
    this.svg.selectAll(".country")
      .data(this.hashRate.filter(d => filterData[d.id] === true))
      .exit()
      .remove();

    country.append("text")
      .datum(d => ({id: d.id, value: d.values[d.values.length - 1]}))
      .attr("transform", d => "translate(" + this.x(d.value.date) + "," + this.y(d.value.hashRate) + ")")
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(d => d.id);

    country.append("g")
      .attr("class", "brush")
      .call(brush);


  }
  private drawLegend(): void {
    const marginLeft = 25;
    const legend = this.g.selectAll('g')
      .data(this.allHashRate)
      .enter()
      .append('g')
      .attr('class', 'legend');
    legend.append("rect")
      .attr("x", this.width + marginLeft)
      .attr("y", (d, i) => i * 25)
      .attr('width', 20)
      .attr('height', 20)
      .style("fill", d => {
        if (this.filterCrypto[d.id]){
          return this.color(d.id);
        }
      })
      .style("stroke", d => this.color(d.id));

    legend.append('text')
      .attr('x', this.width)
      .attr('y', this.margin.top - 30)
      .attr("transform", "translate(10," + 3 + ")")
      .text("Cryptos");

    legend.append('text')
      .attr('x', this.width + marginLeft + 15)
      .attr('y', (d, i) => (i * 25) + 9)
      .attr("transform", "translate(10," + 3 + ")")
      .text(d => d.id);
    legend
      .on("click", (event, d) => this.reDraw(d.id));
  }

  private reDraw(id: string): void {

    console.log(`redraw ${id} -> ${this.filterCrypto[id]}`);
    this.filterCrypto[id] = ! this.filterCrypto[id];
    this.filterCrypto = {...this.filterCrypto};
    this.drawChart(this.filterCrypto);
  }
}
