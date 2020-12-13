import {Component, OnInit} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {GenreSchedule, Settings, ShowPreview} from '../types';
import {ShowComponent} from '../shared/show/show.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../shared/config/config.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {LoadingComponent} from '../shared/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  scheduleByGenres$: Observable<GenreSchedule[]> | undefined;
  loading$ = new BehaviorSubject<boolean>(false);

  loadingDialogRef: MatDialogRef<LoadingComponent> | undefined;

  genres!: string[];

  week = 'current';
  country = 'United States';
  popularity = 'popular';

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

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dialog: MatDialog,
    private readonly configService: ConfigService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {
  }

  ngOnInit(): void {
    this.scheduleByGenres$ = this.configService.settings$.pipe(
      tap(() => {
        this.loading$.next(true);
      }),
      tap(({isNextWeek, countryCode, rating}) => {
        this.setConfigInfo(isNextWeek, countryCode, rating);
      }),
      switchMap((settings: Settings) => this.dashboardService.schedule(settings)),
      map(({schedule}) => this.matShowsByGenre(schedule)),
      tap(() => {
        this.loading$.next(false);
      })
    );

    this.loading$.pipe(
      tap((state: boolean) => {
        if (state) {
          this.loadingDialogRef = this.dialog.open(LoadingComponent, {
            width: '100%',
          });
        } else if (this.loadingDialogRef) {
          this.loadingDialogRef.close();
        }
      })
    ).subscribe();

    // try to open details when id is in url
    const showIdFromRoute = this.route.snapshot.params.id;

    if (showIdFromRoute) {
      this.showDetails(showIdFromRoute);
    }
  }

  /**
   * Opens show dialog
   *
   * @param id show-id
   */
  showDetails(id: string): void {
    this.dialog.open(ShowComponent, {
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
  private matShowsByGenre(schedule: ShowPreview[]): GenreSchedule[] {
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
