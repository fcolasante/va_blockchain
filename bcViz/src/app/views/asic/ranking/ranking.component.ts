import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {Asic} from '../../../models/asic';
import {Algo} from '../algo-legend/algo-legend.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnChanges {
  @Input() color;
  @Input() algo;
  @Input() asic;
  @Output() filteredAlgos = new EventEmitter<Algo[]>();
  private svg;
  private margin = 10;
  private width = 1200 - (this.margin * 2);
  private height = 40 - (this.margin * 2);
  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.algo) {
      this.buildRanking();
    }
  }

  private createSvg(): void {
    console.log("Creating ranking", this.algo);
    this.svg = d3.select("div#ranking")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private buildRanking(): void {
    if (this.algo === undefined) { return; }
    // Add X axis
    if (this.svg) { this.svg.selectAll("*").remove(); }

    this.svg.selectAll('mydots')
      .data(this.algo)
      .enter()
      .append("rect")
      .attr("x", (d, i) => 2 + i * 150 )
      .attr("y", 0)
      .attr('width', 20)
      .attr('height', 20)
      .style("fill", d => d.enabled ? this.color(d.name) : 'white')
      .style("stroke", d => this.color(d.name))
      .on( "click", (event, d) => {
        const newAlgos = this.algo.map( a => a.name === d.name ? ({...a, enabled: ! d.enabled}) : ({...a}));
        this.filteredAlgos.emit( newAlgos);
      });
// Add one dot in the legend for each name.
    this.svg.selectAll("mylabels")
      .data(this.algo)
      .enter()
      .append("text")
      .attr("x",  (d, i) => 30 + i * 150)
      .attr("y", 10 ) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", d => d.enabled ? this.color(d.name) : 'gray')
      .text((d, i) => d.name)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
    this.svg.selectAll("myCryptos")
      .data(this.algo)
      .enter()
      .append("text")
      .attr("x",  (d, i) => 30 + i * 150)
      .attr("y", 15 ) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", d => d.enabled ? this.color(d.name) : 'gray')
      .text((d, i) => d.algos)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }
}
