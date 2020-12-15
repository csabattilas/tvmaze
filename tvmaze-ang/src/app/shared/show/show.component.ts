import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {ShowService} from './show.service';
import {Show} from '../../types';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EMPTY, Observable} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowComponent implements OnInit {
  show$: Observable<Show> | undefined;
  loadingText = '...loading';

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly showService: ShowService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {
  }

  ngOnInit(): void {
    this.show$ = this.showService.show(this.data.id)
      .pipe(
        take(1),
        // only interested in the first value
        catchError((error) => {
          this.loadingText = error;
          this.cd.detectChanges();

          return EMPTY;
        }),
        map(({show}) => {
          return show;
        })
      );
  }
}
