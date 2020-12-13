import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {SearchService} from './search.service';
import {ShowPreview} from '../types';
import {ShowComponent} from '../shared/show/show.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  form: FormGroup;
  result$: Observable<ShowPreview[]> | undefined;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService,
    private readonly dialog: MatDialog,
  ) {
    this.form = this.fb.group({
        q: fb.control('')
      }
    );

    this.result$ = this.form?.get('q')?.valueChanges.pipe(
      filter((q: string) => q.length > 2),
      debounceTime(200),
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
