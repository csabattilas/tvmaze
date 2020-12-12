import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, filter, map, switchMap} from 'rxjs/operators';
import {SearchService} from './search.service';
import {ShowPreview} from '../types';
import {ShowComponent} from '../shared/show/show.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  form: FormGroup;
  result$: Observable<ShowPreview[]> | undefined;

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService,
    private readonly dialog: MatDialog,
  ) {
    this.form = this.fb.group({
        q: fb.control('')
      }
    );
  }

  ngOnInit(): void {
    this.result$ = this.form?.get('q')?.valueChanges.pipe(
      filter((q: string) => q.length > 2),
      debounceTime(200),
      switchMap((q: string) => this.searchService.shows(q)),
      map(({shows}) => shows.filter((item: ShowPreview) => !!item.image))
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
}
