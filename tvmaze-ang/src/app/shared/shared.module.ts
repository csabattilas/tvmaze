import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShowPreviewComponent} from './show-preview/show-preview.component';
import {ShowComponent} from './show/show.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ConfigComponent} from './config/config.component';
import {MatRadioModule} from '@angular/material/radio';
import {TopBarComponent} from './top-bar/top-bar.component';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    ShowPreviewComponent,
    ShowComponent,
    ConfigComponent,
    TopBarComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ShowComponent,
    ShowPreviewComponent,
    TopBarComponent,
  ],
  entryComponents: [
    ShowComponent,
    LoadingComponent,
  ]
})
export class SharedModule {
}
