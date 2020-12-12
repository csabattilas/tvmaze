import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowComponent} from './show.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('ShowComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowComponent],
      imports: [MatDialogModule, ApolloTestingModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {id: 1}
        }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
