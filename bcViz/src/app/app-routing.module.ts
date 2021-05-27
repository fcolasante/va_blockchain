import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AsicComponent} from './containers/asic/asic.component';
import {HashRateComponent} from './containers/hash-rate/hash-rate.component';
import {TreeComponent} from './containers/tree/tree.component';

const routes: Routes = [
  { path: 'asic', component: AsicComponent },
  { path: 'hashrate', component: HashRateComponent },
  { path: 'tree', component: TreeComponent },
  { path: '',   redirectTo: '/asic', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
