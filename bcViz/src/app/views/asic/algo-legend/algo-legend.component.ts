import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Asic} from '../../../models/asic';
import * as d3 from 'd3';

export interface Algo {
  name: string;
  enabled: boolean;
  cryptos: string[];
}

@Component({
  selector: 'app-algo-legend',
  templateUrl: './algo-legend.component.html',
  styleUrls: ['./algo-legend.component.scss']
})
export class AlgoLegendComponent implements OnInit, OnChanges {
  @Input() asic: Asic [];
  @Output() filteredAlgos = new EventEmitter<Algo[]>();
  @Input() algos: Algo[];
  constructor() { }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.asic !== undefined && !changes.asic.isFirstChange()) {
      console.log(this.algos);
    }
  }

  drawLegend(data): void {}

  updateAlgo(): void {
    console.log(this.algos);
    this.filteredAlgos.emit(this.algos);
  }

  mean(algo: string): number {
    return d3.mean(this.asic.filter( a => a.algo === algo).map( a => a.hashRate));
  }

}
