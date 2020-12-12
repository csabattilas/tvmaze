import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {DashboardService} from './dashboard.service';
import {SharedModule} from '../shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {Location} from '@angular/common';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
  ],
  providers: [
    DashboardService,
    Location
  ]
})
export class DashboardModule {
}
