import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, filter, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {SearchService} from './search.service';
import {ShowPreview} from '../types';
import {ShowComponent} from '../shared/show/show.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {start} from 'repl';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy, OnInit {
  form: FormGroup;
  result$: Observable<ShowPreview[]> | undefined;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private activeQuery = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {
    const queryFromRoute = this.route.snapshot.params.q;

    if (queryFromRoute) {
      this.activeQuery = queryFromRoute;
    }

    this.form = this.fb.group({
        q: fb.control('')
      }
    );

    this.result$ = this.form.get('q')?.valueChanges.pipe( // q should exist
      startWith(this.activeQuery),
      filter((q: string) => q.length > 2),
      debounceTime(200),
      tap((q: string) => {
        this.activeQuery = q;
      }),
      switchMap((q: string) => this.searchService.search(q)),
      map(({shows}) => shows.filter((item: ShowPreview) => !!item.image)),
      takeUntil(this.ngUnsubscribe),
    );
  }

  showDetails(id: string): void {
    this.dialog.open(ShowComponent, {
      panelClass: 'show-dialog',
      data: {
        id
      }
    });

    this.location.replaceState(`/search/${id}/${this.activeQuery}`);
  }

  ngOnInit(): void {
    const showIdFromRoute = this.route.snapshot.params.id;
    const queryFromRoute = this.route.snapshot.params.q;

    if (showIdFromRoute) {
      this.showDetails(showIdFromRoute);
    }

    if (queryFromRoute && this.form.get('q')) {
      const queryControl = this.form.get('q');

      if (queryControl) {
        queryControl.setValue(queryFromRoute);
      }
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
