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
  private margin = 25;
  private width = 200 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.algo) {
      console.log("RANKING", changes);
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
  /**
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
**/
  private buildRanking(): void {
    if (this.algo === undefined) { return; }
    // Add X axis
    if (this.svg) { this.svg.selectAll("*").remove(); }
    console.log("Building ranking with", this.algo);
    this.svg.append("text")
      .attr('transform', `translate(${this.width / 2 }, ${0})`)
      .style("text-anchor", "middle")
      .text("Color legend");

    this.svg.selectAll('mydots')
      .data(this.algo)
      .enter()
      .append("rect")
      .attr("x", 0 )
      .attr("y", (d, i) => 2 + i * 25)
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
      .attr("x", 20)
      .attr("y", (d, i) => 15 + i * 25) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", d => d.enabled ? this.color(d.name) : 'gray')
      .text((d, i) => (i + 1 ) + ". " + d.name)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

  }
}
