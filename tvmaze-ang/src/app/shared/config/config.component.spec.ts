import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigComponent} from './config.component';
import {SharedModule} from '../shared.module';
import {ConfigService} from './config.service';
import {By} from '@angular/platform-browser';

fdescribe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let configService: ConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigComponent ],
      imports: [SharedModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form group', () => {
    expect(component.form).toBeDefined();

    expect(component.form.get('rating')).toBeDefined();
    expect(component.form.get('countryCode')).toBeDefined();
    expect(component.form.get('week')).toBeDefined();
  });

  it('should create from template', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('mat-radio-button')).length).toBe(7);
  });

  it('should call config service when control values are changing', () => {
    spyOn(configService, 'updateSettings');

    component.form.get('rating')?.setValue('7');

    expect(configService.updateSettings).toHaveBeenCalledWith({rating: 7, countryCode: 'US', isNextWeek: false});
  });
});
