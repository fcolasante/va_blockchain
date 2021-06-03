import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScatterComponent } from './views/asic/scatter/scatter.component';
import { ParallelComponent } from './views/asic/parallel/parallel.component';
import { HrSeriesComponent } from './views/hashRate/hr-series/hr-series.component';
import {DecimalPipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import { AsicTableComponent } from './views/asic/asic-table/asic-table.component';
import { StackedHRComponent } from './views/hashRate/stacked-hr/stacked-hr.component';
import { CryptoFilterComponent } from './crypto-filter/crypto-filter.component';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PcaComponent } from './views/asic/pca/pca.component';
import { AsicComponent } from './containers/asic/asic.component';
import { HashRateComponent } from './containers/hash-rate/hash-rate.component';
import { AlgoLegendComponent } from './views/asic/algo-legend/algo-legend.component';
import { TreeComponent } from './containers/tree/tree.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RankingComponent } from './views/asic/ranking/ranking.component';
import { CountryConsumptionComponent } from './views/hashRate/country-consumption/country-consumption.component';
import { BarRaceComponent } from './views/hashRate/bar-race/bar-race.component';



@NgModule({
  declarations: [
    AppComponent,
    ScatterComponent,
    ParallelComponent,
    HrSeriesComponent,
    AsicTableComponent,
    StackedHRComponent,
    CryptoFilterComponent,
    PcaComponent,
    AsicComponent,
    HashRateComponent,
    AlgoLegendComponent,
    TreeComponent,
    RankingComponent,
    CountryConsumptionComponent,
    BarRaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSortModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FlexLayoutModule
  ],
  providers: [ DecimalPipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
