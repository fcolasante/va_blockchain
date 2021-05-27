import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-crypto-filter',
  templateUrl: './crypto-filter.component.html',
  styleUrls: ['./crypto-filter.component.scss']
})
export class CryptoFilterComponent implements OnInit {
  filterCrypto = { "BTC":true,
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
  filteredCrypto = [
    { name: "BTC", enabled: true},
    { name: "LTC", enabled: true},
    { name: "XMR" , enabled: false },
    { name: "BCH" , enabled: false},
    { name: "BSV" , enabled: false},
    { name: "DASH", enabled: false},
    { name: "DOGE", enabled: false},
    { name: "ETC", enabled: false},
    { name: "VTC" , enabled: false},
    {name: "ZEC" , enabled:  false}
  ];
  @Output() newFilteredCrypto = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
