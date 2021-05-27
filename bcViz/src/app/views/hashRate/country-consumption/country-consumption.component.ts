import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {CryptoHash, HashPoint} from '../../../models/HashPoint';
import {FormControl} from '@angular/forms';
import {Cryptocurrecy} from '../../../containers/hash-rate/hash-rate.component';

export interface Country {
  name: string;
  legendName: string;
  cons2019: number;
  isCrypto: boolean;
  position?: number;
}
@Component({
  selector: 'app-country-consumption',
  templateUrl: './country-consumption.component.html',
  styleUrls: ['./country-consumption.component.scss']
})
export class CountryConsumptionComponent implements OnInit, OnChanges {
  @Input() cryptos: Cryptocurrecy[];
  @Input() country: Country[];
  @Input() allHashRate: CryptoHash[];
  @Input() color;
  countryWithCrypto: Country[];
  private margin = { top: 20, right: 80, bottom: 60, left: 60 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  years = new FormControl();
  yearsList = [2016, 2017, 2018, 2019];
  private svg;
  private g;
  private myBar;
  currentYear: number = 2016;
  currentCrypto: string = "BTC";
  currentConsumption: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.country !== undefined) {
      this.computeConsumption();
      this.buildBarPlot();
    }
  }
  updateYear(control): void {
    this.currentYear = control.value;
    this.computeConsumption();
    this.buildBarPlot();
  }
  updateCrypto(control): void {
    this.currentCrypto = control.value;
    this.computeConsumption();
    this.buildBarPlot();
  }
  ngOnInit(): void {
    // this.createSvg();
  }
  private createSvg(): void {
    this.svg = d3.select("figure#barplot")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  computeConsumption(): void {
    const efficiency = 0.21;
    console.log(this.allHashRate);
    const btc2019 = this.allHashRate.find( e => e.id === this.currentCrypto)
      .values.filter( (hp) => hp.date.getFullYear() === this.currentYear)
          .map( hp => hp.hashRate * efficiency * 1000 / Math.pow(10, 6)  * 24)
          .reduce( (v1, v2) => v1 + v2, 0) / Math.pow(10, 6);
    this.currentConsumption = btc2019;
    console.log(btc2019);
    this.countryWithCrypto = [...this.country, {name: this.currentCrypto,
      legendName: this.currentCrypto + this.currentYear,
      cons2019: btc2019, isCrypto: true}];
    console.log(this.countryWithCrypto);
  }

  buildBarPlot(): void{
    if (this.svg !== undefined) { d3.select("figure#barplot").selectChild().remove(); }
    this.createSvg();
    const sortedData = this.countryWithCrypto.sort((b, a) => a.cons2019 - b.cons2019)
      .map( (c: Country, index) => ({...c, position: index + 1}));
    const idx = sortedData.findIndex(  c => c.name === this.currentCrypto);
    const data = sortedData.map( (c, i) => ({...c, legendName: c.position + ". " + c.name})).slice(idx - 7, idx + 7);
    // X axis
    const x = d3.scaleBand()
      .range([ 0, this.width ])
      .domain(data.map(d => d.legendName))
      .padding(0.2);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.cons2019))
      .range([ this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    const myBar = this.svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.legendName))
      .attr("y", d => y(d.cons2019))
      .attr("width", x.bandwidth())
      .attr("height", d => this.height - y(d.cons2019))
      .attr("fill", d => d.isCrypto ? this.color(d.name) : "#69b3a2");
  }

}
