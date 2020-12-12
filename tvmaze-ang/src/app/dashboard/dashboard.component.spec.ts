import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {DashboardService} from './dashboard.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [MatDialogModule, NoopAnimationsModule, SharedModule, ApolloTestingModule],
      providers: [
        DashboardService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: 1
              }
            }
          }
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
