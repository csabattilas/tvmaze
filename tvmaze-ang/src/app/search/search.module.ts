import {NgModule} from '@angular/core';
import {SearchComponent} from './search.component';
import {SearchService} from './search.service';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    SearchService,
  ]
})
export class SearchModule { }
