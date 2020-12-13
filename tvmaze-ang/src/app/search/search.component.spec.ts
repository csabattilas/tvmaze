import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {SharedModule} from '../shared/shared.module';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SearchService} from './search.service';
import {MatDialogModule} from '@angular/material/dialog';
import {By} from '@angular/platform-browser';
import {EMPTY} from 'rxjs';
import {DebugElement} from '@angular/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;
  let searchField: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [MatDialogModule, SharedModule, ApolloTestingModule, NoopAnimationsModule],
      providers: [SearchService],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);

    searchField = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form group', () => {
    expect(component.form).toBeDefined();

    expect(component.form.get('q')).toBeDefined();
  });

  it('should create from template', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(1);
  });

  it('should call config service when control value is changing and the value string in length is more than 2 (integration and debounce)',
    fakeAsync(() => {
      spyOn(searchService, 'search').and.returnValue(EMPTY);

      fixture.detectChanges();

      searchField.nativeElement.value = 'gr';
      searchField.nativeElement.dispatchEvent(new Event('input'));

      expect(searchService.search).not.toHaveBeenCalled();

      searchField.nativeElement.value = 'gre';
      searchField.nativeElement.dispatchEvent(new Event('input'));

      tick();
      tick(300);

      expect(searchService.search).toHaveBeenCalledWith('gre');
    }));

  it('should call config service when control value is changing and the value string in length is less than 3', fakeAsync(() => {
    component.result$?.subscribe(); // manual subscribe

    spyOn(searchService, 'search').and.returnValue(EMPTY);

    component.form.get('q')?.setValue('g');

    tick();
    tick(300); // not matter how long i wait the filter in the implementation will prevent the debounce anyways.

    expect(searchService.search).not.toHaveBeenCalled();
  }));
});
