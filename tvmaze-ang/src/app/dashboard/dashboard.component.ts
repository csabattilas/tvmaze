import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {GenreSchedule, Settings, ShowPreview} from '../types';
import {ShowComponent} from '../shared/show/show.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../shared/config/config.service';
import {catchError, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {LoadingComponent} from '../shared/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  scheduleByGenres$: Observable<GenreSchedule[]> | undefined;

  genres!: string[];

  week = 'current';
  country = 'United States';
  popularity = 'popular';
  error = '';

  countries = [
    {
      code: 'US',
      name: 'United States'
    },
    {
      code: 'NL',
      name: 'Netherlands',
    },
  ];

  popularities = [
    {
      rating: 0,
      name: 'All'
    },
    {
      rating: 6,
      name: 'popular',
    },
    {
      rating: 7,
      name: 'Very popular',
    },
  ];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private loading$: Subject<boolean> = new Subject<boolean>();
  private loadingDialogRef: MatDialogRef<LoadingComponent> | undefined;
  private showDialogRef: MatDialogRef<ShowComponent> | undefined;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dialog: MatDialog,
    private readonly configService: ConfigService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {
    this.loading$.pipe(
      tap((state: boolean) => {
        if (state) {
          this.loadingDialogRef = this.dialog.open(LoadingComponent, {
            width: '100%',
          });
        } else if (this.loadingDialogRef) {
          this.loadingDialogRef.close();
        }
      }),
      takeUntil(this.ngUnsubscribe),
    ).subscribe();
  }

  ngOnInit(): void {
    this.scheduleByGenres$ = this.configService.settings$.pipe(
      tap(() => {
        this.loading$.next(true);
      }),
      tap(({isNextWeek, countryCode, rating}) => {
        this.setConfigInfo(isNextWeek, countryCode, rating);
      }),
      tap(() => {
        this.error = '';
      }),
      switchMap((settings: Settings) => this.dashboardService.schedule(settings)),
      catchError((error) => {
        this.error = error;
        this.loading$.next(false);

        return of({schedule: []});
      }),
      map(({schedule}) => this.mapShowsByGenre(schedule)),
      tap(() => {
        this.loading$.next(false);
      }),
      takeUntil(this.ngUnsubscribe),
    );

    // try to open details when id is in url
    const showIdFromRoute = this.route.snapshot.params.id;

    if (showIdFromRoute) {
      this.showDetails(showIdFromRoute);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Opens show dialog
   *
   * @param id show-id
   */
  showDetails(id: string): void {
    this.showDialogRef = this.dialog.open(ShowComponent, {
      width: '70%',
      panelClass: 'show-dialog',
      data: {
        id
      }
    });

    this.location.replaceState(`/dashboard/${id}`);
  }


  /**
   *
   * Content update helper based on config settings
   *
   * @param isNextWeek indicates if next or current
   * @param countryCode network's country code
   * @param rating show rating
   */
  private setConfigInfo(isNextWeek: boolean, countryCode: string, rating: number): void {
    this.week = isNextWeek ? 'next' : 'current';
    this.country = this.countries.find(country => country.code === countryCode)?.name || '';
    this.popularity = this.popularities.find(popularity => popularity.rating === rating)?.name || '';
  }


  /**
   * Reduces showPreview info to genre categories
   *
   * @param schedule holds ShowPreview typed Array.
   */
  private mapShowsByGenre(schedule: ShowPreview[]): GenreSchedule[] {
    return schedule
      .reduce((acc: GenreSchedule[], item: ShowPreview) => {
        const genreFound = acc.find(accItem => accItem.genre === item.genre);

        if (genreFound) {
          genreFound.shows.push(item);
        } else {
          acc.push({genre: item.genre, shows: [item]});
        }

        return acc;
      }, [])
      .sort((a: GenreSchedule, b: GenreSchedule) => {
        return a.shows.length > b.shows.length ? -1 : 1;
      });
  }
}
