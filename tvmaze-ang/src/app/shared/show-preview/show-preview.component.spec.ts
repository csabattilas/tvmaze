import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPreviewComponent } from './show-preview.component';

describe('ShowPreviewComponent', () => {
  let component: ShowPreviewComponent;
  let fixture: ComponentFixture<ShowPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should prettify airing date', () => {
    component.show = {
      airdate: '2020-12-13',
      airtime: '15:00',
      id: '1',
      name: 'my show',
      genre: 'Comedy',
      rating: 1
    };

    fixture.detectChanges();

    expect(component.airing).toEqual('12/13 15:00');
  });
});
