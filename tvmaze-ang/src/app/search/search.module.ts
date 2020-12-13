import {NgModule} from '@angular/core';
import {SearchComponent} from './search.component';
import {SearchService} from './search.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    SearchService,
  ]
})
export class SearchModule { }
