import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bcViz';
  hashRate: any[];
  filteredCrypto: any;
  ngOnInit() {}

}

