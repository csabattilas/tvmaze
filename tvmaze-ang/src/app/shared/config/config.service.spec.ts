import {TestBed} from '@angular/core/testing';

import {ConfigService} from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should push new values to its setting Subject', () => {
    expect(service.settings$.getValue().rating).toEqual(6);
    expect(service.settings$.getValue().countryCode).toEqual('US');

    spyOn(service.settings$, 'next');

    service.updateSettings({isNextWeek: true, rating: 6, countryCode: 'US'});

    expect(service.settings$.next).toHaveBeenCalledWith({isNextWeek: true, rating: 6, countryCode: 'US'});
  });
});
