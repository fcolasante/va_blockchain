import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Asic} from '../../../models/asic';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-asic-table',
  templateUrl: './asic-table.component.html',
  styleUrls: ['./asic-table.component.scss']
})
export class AsicTableComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = ['model', 'profitability', 'hashRate', 'algo', 'power', 'efficiency', 'release'];
  @Input() data;
  dataSource: MatTableDataSource<Asic>;
  constructor() { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      const filteredData = this.data.filter( (asic: Asic) => asic.enabled);
      // console.log(filteredData);
      if ((filteredData === null || filteredData.length === 0)) return;
      this.dataSource = new MatTableDataSource<Asic>(filteredData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
