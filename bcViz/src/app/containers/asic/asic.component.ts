import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {Asic} from '../../models/asic';
import {Algo} from '../../views/asic/algo-legend/algo-legend.component';


const algos = [
  { name: 'SHA-256', enabled: true, cryptos: ['Bitcoin [BTC]', 'Bitcoin Cash [BCH]', 'Bitcoin SV[BSV]']},
  { name: 'Eaglesong', enabled: true, cryptos: ['Nervos [CKB]']},
  { name: 'Equihash', enabled: true, cryptos: ['Zcash [ZEC]']},
  { name: 'EtHash', enabled: true, cryptos: ['Ethereum [ETH]', 'Ethereum Classic [ETC]']},
  { name: 'Scrypt', enabled: true, cryptos: ['Dogecoin [DOGE]', 'Litecoin [LTC]']},
  { name: 'X11', enabled: true, cryptos: ['Dash [DASH]']},
  { name: 'CryptoNight', enabled: true, cryptos: ['Monero [XMR]']},
];

@Component({
  selector: 'app-asic',
  templateUrl: './asic.component.html',
  styleUrls: ['./asic.component.scss']
})
export class AsicComponent implements OnInit {
  private parseTime = d3.timeParse("%Y-%m-%d");
  private parseDesTime = d3.timeParse("%b\xa0%Y");

  colorAlgo = d3.scaleOrdinal(d3.schemeCategory10);
  originalAsic: Asic[];
  asic: Asic[];
  algos: Algo[];
  selectedAsic: Asic;

  constructor() { }

  ngOnInit(): void {
    d3.csv('assets/asic_final.csv')
      .then( data => {
        console.log(data);
        const updatedData: Asic[] = data.map( d => {
          return ({
              model: d.model,
              profitability: +d.profitability,
              release: this.parseDesTime(d.release),
              hashRate: +d.hashRate,
              power: +d.power,
              algo: d.algo,
              efficiency: +d.efficiency,
              pca_X: +d.X,
              pca_Y: +d.Y,
              enabled: true
            }
          );
        });
        this.originalAsic = updatedData;
        this.asic = updatedData;
        const onlyUnique = (value, index, self) => self.indexOf(value) === index;
        // this.algos = this.asic.map( d => d.algo).filter(onlyUnique).map( name => ({name, enabled: true}));
        this.algos = algos;
        this.colorAlgo.domain(d3.extent(this.algos, d => d.name));
      });


  }

  updateAsic(newAsic: Asic[]): void {
    this.asic = newAsic;
  }
  reset(): void{
    this.asic = this.originalAsic;
  }

  filterByAlgo(algos: Algo[]): void{
    this.algos = [...algos];
    const algosName = algos.filter( a => a.enabled).map( a => a.name);
    this.asic = this.originalAsic.filter( a => algosName.includes(a.algo));
    // console.log(this.asic);
  }

  selectAsic(asic: Asic): void {
    this.selectedAsic = asic;
  }
}
