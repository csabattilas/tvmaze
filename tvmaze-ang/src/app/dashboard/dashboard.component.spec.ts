import {ComponentFixture, fakeAsync, flush, TestBed, waitForAsync} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {DashboardService} from './dashboard.service';
import {MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../shared/shared.module';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';
import {EMPTY, of} from 'rxjs';
import {LoadingComponent} from '../shared/loading/loading.component';
import {ShowComponent} from '../shared/show/show.component';
import {By} from '@angular/platform-browser';
import {scheduleMock} from './test-mocks/schedule-data';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  let componentPrivate: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [MatDialogModule, NoopAnimationsModule, SharedModule, ApolloTestingModule],
      providers: [
        DashboardService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '1'
              }
            }
          }
        }
      ],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    componentPrivate = component;

    dashboardService = TestBed.inject(DashboardService);
  }));

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should open loading mod when starting to refresh data', () => {
    spyOn(componentPrivate.loading$, 'next').and.callThrough();
    spyOn(componentPrivate.dialog, 'open').and.callThrough();
    spyOn(dashboardService, 'schedule').and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(componentPrivate.loading$.next).toHaveBeenCalledWith(true);
    expect(componentPrivate.dialog.open).toHaveBeenCalledWith(LoadingComponent, {
      width: '100%',
    });
    expect(componentPrivate.loadingDialogRef).toBeDefined();
  });

  it('should call setConfigInfo', fakeAsync(() => {
    spyOn(componentPrivate, 'setConfigInfo');
    spyOn(dashboardService, 'schedule').and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(componentPrivate.setConfigInfo).toHaveBeenCalledWith(false, 'US', 6);
  }));

  it('should call dashboard service schedule', () => {
    component.scheduleByGenres$?.subscribe();

    spyOn(dashboardService, 'schedule').and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(dashboardService.schedule).toHaveBeenCalledWith({rating: 6, isNextWeek: false, countryCode: 'US'});
  });

  it('should close loading modal after data arrived', fakeAsync(() => {
    const spyLoading = spyOn(componentPrivate.loading$, 'next').and.callThrough();

    spyOn(componentPrivate.dialog, 'open').and.callThrough();
    spyOn(componentPrivate, 'mapShowsByGenre').and.callThrough();
    spyOn(dashboardService, 'schedule').and.returnValue(of({schedule: []}));

    fixture.detectChanges(); // kick in subscription

    expect(componentPrivate.loading$.next).toHaveBeenCalledWith(true);
    expect(componentPrivate.loadingDialogRef).toBeDefined();
    // spyOn(componentPrivate.loadingDialogRef, 'close');

    expect(componentPrivate.loadingDialogRef).toBeDefined();
    expect(spyLoading.calls.count()).toEqual(2);
    expect(componentPrivate.loading$.next.calls.argsFor(1)).toEqual([false]);

    // todo fix this!
    // expect(componentPrivate.loadingDialogRef.close).toHaveBeenCalled();

    flush();
  }));

  it('should open show details modal', () => {
    spyOn(componentPrivate.dialog, 'open');

    component.showDetails('1');
    expect(componentPrivate.dialog.open).toHaveBeenCalledWith(ShowComponent, {
      width: '70%',
      panelClass: 'show-dialog',
      data: {
        id: '1'
      }
    });
  });

  it('should update location when opening show modal', () => {
    spyOn(componentPrivate.location, 'replaceState');

    component.showDetails('101');
    expect(componentPrivate.location.replaceState).toHaveBeenCalledWith('/dashboard/101');
  });

  it('should open show dialog when router snapshot has id', () => {
    spyOn(component, 'showDetails');

    fixture.detectChanges();

    expect(component.showDetails).toHaveBeenCalledWith('1');
  });

  it('should update dashboard with data from apollo-client', fakeAsync(() => {
    const controller = TestBed.inject(ApolloTestingController);

    fixture.detectChanges();

    const op = controller.expectOne('ScheduleQuery');

    op.flush({
      data: {
        schedule: scheduleMock,
      },
    });

    flush();

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('div > ul > li')).length).toEqual(4);

    expect(fixture.debugElement
      .queryAll(By.css('div > ul > li'))[0]
      .queryAll(By.css('li')).length).toEqual(3);

    // todo add more cases
  }));

  describe('setConfigInfo', () => {
    it('should update template title accordingly (integration)', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toContain('United States');
      expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toContain('popular');
      expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toContain('current week');
    });
  });

  describe('mapShowsByGenre', () => {
    it('should map shows by gendre', () => {
      expect(componentPrivate.mapShowsByGenre(scheduleMock).length).toEqual(4);
      expect(componentPrivate.mapShowsByGenre(scheduleMock)[0].genre).toEqual('Various');
      expect(componentPrivate.mapShowsByGenre(scheduleMock)[0].shows.length).toEqual(3);

      // todo more expectation can be added here
    });
  });
});
