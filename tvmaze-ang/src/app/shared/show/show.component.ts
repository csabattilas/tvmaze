import {Component, Inject, OnInit} from '@angular/core';
import {ShowService} from './show.service';
import {Show} from '../../types';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  show$: Observable<Show> | undefined;

  constructor(
    private readonly showService: ShowService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {
  }

  ngOnInit(): void {
    console.log(this.data.id);
    this.show$ = this.showService.show(this.data.id)
      .pipe(
        map(({show}) => show)
      );
  }
}
