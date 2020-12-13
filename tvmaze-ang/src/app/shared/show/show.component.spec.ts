import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowComponent} from './show.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ShowService} from './show.service';
import {EMPTY} from 'rxjs';
import {SharedModule} from '../shared.module';

describe('ShowComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;
  let showService: ShowService;

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
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
    showService = TestBed.inject(ShowService);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('expect to call show service show', () => {
    spyOn(showService, 'show').and.returnValue(EMPTY);

    fixture.detectChanges();

    expect(showService.show).toHaveBeenCalledWith('101');
  });
});
