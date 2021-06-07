import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import {Asic} from "../../../models/asic";

export interface RaceEntry {
  name: string
  lastValue: number;
  value: number;
  year: number;
  colour: any;
  rank?: number;
}

@Component({
  selector: 'app-bar-race',
  templateUrl: './bar-race.component.html',
  styleUrls: ['./bar-race.component.scss']
})
export class BarRaceComponent implements OnInit {
  private margin = { top: 50, right: 0, bottom: 30, left: 100 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 840 - this.margin.top - this.margin.bottom;
  private svg;
  private g;

  private tickDuration = 500;
  private incrementTimeSlot = 500;

  private barPadding;
  // tslint:disable-next-line:variable-name
  private top_n = 40;
  private year = 2016;
  private finalYear = 2049;
  constructor() { }
  private fileName = ['assets/race_data.csv', 'assets/race_sameHR.csv'];
  ngOnInit(): void {
    d3.csv(this.fileName[0])
      .then( rawData => {
        const data: RaceEntry[] = rawData.map(d => {
          // @ts-ignore
          return ({
            name: d.name,
            lastValue: +d.lastValue,
            value: isNaN(+d.value) ? 0 : +d.value,
            year: +d.year,
            colour: d3.hsl(Math.random() * 360, 0.75, 0.75)
          });
        });
        console.log("Race", data);
        this.createSvg();
        this.drawChart();
        this.plot(data);
      });


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
    this.barPadding = (this.height - (this.margin.bottom + this.margin.top)) / ( this.top_n * 3 );

    const title = this.svg.append('text')
      .attr('class', 'title')
      .attr('y', 24)
      .html('Energy consumption [TWh/year]');
    /*
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
    */

  }

  private plot(data: RaceEntry[]): void  {
    // tslint:disable-next-line:only-arrow-functions
    const halo = function(text, strokeWidth) {
      text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .style('fill', 'white')
        .style( 'stroke', 'white')
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('opacity', 1);

    };

    let yearSlice = data.filter(d => d.year === this.year && !isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, this.top_n);

    yearSlice.forEach((d, i) => d.rank = i);

    console.log('yearSlice: ', yearSlice);

    const x = d3.scaleLinear()
      .domain([0, d3.max(yearSlice, d => d.value)])
      .range([this.margin.left, this.width - this.margin.right - 15]);

    const y = d3.scaleLinear()
      .domain([this.top_n, 0])
      .range([this.height - this.margin.bottom, this.margin.top]);

    const xAxis = d3.axisTop(x)
      .ticks(this.width > 500 ? 5 : 2)
      .tickSize(-(this.height - this.margin.top - this.margin.bottom))
      .tickFormat(d => d3.format(',')(d));

    this.svg.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${this.margin.top})`)
      .call(xAxis)
      .selectAll('.tick line')
      .classed('origin', d => d === 0);

    this.svg.selectAll('rect.bar')
      .data(yearSlice, d => d.name)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', x(0) + 1)
      .attr('width', d => x(d.value) - x(0) - 1)
      .attr('y', d => y(d.rank) + 5)
      .attr('height', y(1) - y(0) - this.barPadding)
      .style('fill', d => d.colour);
    this.svg.selectAll('text.label')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.value) - 8)
      .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
      .style('text-anchor', 'end')
      .html(d => d.name);
    /**
    this.svg.selectAll('text.label')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d =>  0)
      .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
      .style('text-anchor', 'start')
      .html(d => d.name);
    **/
    this.svg.selectAll('text.valueLabel')
      .data(yearSlice, d => d.name)
      .enter()
      .append('text')
      .attr('class', 'valueLabel')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
      .text(d => d3.format(',.0f')(d.lastValue));

    const yearText = this.svg.append('text')
      .attr('class', 'yearText')
      .style("font-size", "34px")
      .attr('x', this.width - this.margin.right)
      .attr('y', this.height - 25)
      .style('text-anchor', 'end')
      .html(this.year)
      .call(halo, 10);

    const ticker = d3.interval(e => {

      yearSlice = data.filter(d => d.year === this.year && !isNaN(d.value))
        .sort((a, b) => b.value - a.value)
        .slice(0, this.top_n);

      yearSlice.forEach((d, i) => d.rank = i);

      // console.log('IntervalYear: ', yearSlice);

      x.domain([0, d3.max(yearSlice, d => d.value)]);

      this.svg.select('.xAxis')
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis);

      const bars = this.svg.selectAll('.bar').data(yearSlice, d => d.name);

      bars
        .enter()
        .append('rect')
        .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
        .attr('x', x(0) + 1)
        .attr( 'width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(this.top_n + 1) + 5)
        .attr('height', y(1) - y(0) - this.barPadding)
        .style('fill', d => d.colour)
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('y', d => y(d.rank) + 5);

      bars
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(d.rank) + 5);

      bars
        .exit()
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(this.top_n + 1) + 5)
        .remove();

      const labels = this.svg.selectAll('.label')
        .data(yearSlice, d => d.name);

      labels
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) - 8)
        .attr('y', d => y(this.top_n + 1) + 5 + ((y(1) - y(0)) / 2))
        .style('text-anchor', 'end')
        .html(d => d.name)
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);


      labels
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('x', d => x(d.value) - 8)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

      labels
        .exit()
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('x', d => x(d.value) - 8)
        .attr('y', d => y(this.top_n + 1) + 5)
        .remove();



      const valueLabels = this.svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

      valueLabels
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(this.top_n + 1) + 5)
        .text(d => d3.format(',.0f')(d.lastValue))
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

      valueLabels
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .tween("text", d => {
          const i = d3.interpolateRound(d.lastValue, d.value);
          return function(t) {
            this.textContent = d3.format(',')(i(t));
          };
        });


      valueLabels
        .exit()
        .transition()
        .duration(this.tickDuration)
        .ease(d3.easeLinear)
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(this.top_n + 1) + 5)
        .remove();

      yearText.html(this.year);

      if (this.year === this.finalYear) { ticker.stop(); }
      this.year = +d3.format('.1f')((+this.year) + 1);
    }, this.incrementTimeSlot);

    // tslint:disable-next-line:only-arrow-functions


  }

}
