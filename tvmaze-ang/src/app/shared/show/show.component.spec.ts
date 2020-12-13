import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ShowComponent} from './show.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';
import {ShowService} from './show.service';
import {of} from 'rxjs';
import {SharedModule} from '../shared.module';
import {showMock} from './test-mocks/show-mock';
import {By} from '@angular/platform-browser';

describe('ShowComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;
  let showService: ShowService;
  let apolloController: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowComponent],
      imports: [MatDialogModule, ApolloTestingModule, SharedModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {id: '101'}
        },
        ShowService,
      ],
    });

    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
    showService = TestBed.inject(ShowService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should to call show service show', () => {
    spyOn(showService, 'show').and.returnValue(of({ show: {name: '', episodes: []} }));

    fixture.detectChanges();

    expect(showService.show).toHaveBeenCalledWith('101');
  });

  it('should have show details in template (integration)', fakeAsync(() => {
    fixture.detectChanges();

    const op = apolloController.expectOne('showQuery');

    expect(op.operation.variables.id).toEqual('101');

    op.flush({
      data: {
        show: showMock,
      },
    });

    tick();

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toEqual('S.W.A.T.');
    expect(fixture.debugElement.query(By.css('.show-info-container__summary')).nativeElement.textContent).toEqual('summary info');
    expect(fixture.debugElement.query(By.css('img')).properties.src).toEqual('http://static.tvmaze.com/uploads/images/medium_portrait/280/701986.jpg');
    // todo expectation here

    apolloController.verify();
  }));
});
