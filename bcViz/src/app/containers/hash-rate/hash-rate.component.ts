import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {CryptoHash} from '../../models/HashPoint';
import {Country} from '../../views/hashRate/country-consumption/country-consumption.component';

export interface Cryptocurrecy {
  symbol: string;
  name: string;
  enabled: boolean;
  efficiency: number;
}
const cryptos: Cryptocurrecy[] = [
  {symbol: "BTC", name: "Bitcoin",  enabled: false, efficiency: 0.029 },
  {symbol: "BCH", name: "Bitcoin Cash",  enabled: true, efficiency: 0.031 },
  {symbol: "ETH", name: "Ethereum", enabled: true,  efficiency: 1278  },
  {symbol: "ETC", name: "Ethereum classic",  enabled: true, efficiency: 1278 },
  {symbol: "LTC", name: "Litecoin", enabled: true,  efficiency: 101   },
  {symbol: "XMR", name: "Monero",   enabled: true,  efficiency: 2187500},
  {symbol: "DASH", name: "Dash",  enabled: true, efficiency: 5 },
  {symbol: "ZEC", name: "Bitcoin Cash",  enabled: true, efficiency: 0.00000359},
  {symbol: "BSV", name: "Dogecoin",  enabled: true, efficiency: 0.0305 },
  {symbol: "DOGE", name: "Dogecoin",  enabled: true, efficiency: 954 },
  {symbol: "VTC", name: "Bitcoin Cash",  enabled: true, efficiency: 84.87 },
];

@Component({
  selector: 'app-hash-rate',
  templateUrl: './hash-rate.component.html',
  styleUrls: ['./hash-rate.component.scss']
})
export class HashRateComponent implements OnInit {
  originalSeries: any[];
  allHashRate: CryptoHash[];
  hashRate: CryptoHash[];
  consumption: Country[];
  color = d3.scaleOrdinal(d3.schemeCategory10);
  cryptos = cryptos;
  private parseTime = d3.timeParse("%Y-%m-%d");
  constructor() { }

  ngOnInit(): void {
    d3.csv('assets/hashrate_complete.csv')
      .then( data => {
        this.originalSeries = data;
        this.allHashRate = data.columns.slice(1).map( id => {
          return { id, values: data.map(d => ({date: this.parseTime(d.date), hashRate: +d[id]}) )};
        });
      }).catch(error => console.log(error));

    d3.csv('assets/country_consumption.csv')
      .then( data => {
        this.consumption = data.map(d => ({name: d.country, cons2019: +d.cons2019, isCrypto: false} as Country));
      });

  }
}
