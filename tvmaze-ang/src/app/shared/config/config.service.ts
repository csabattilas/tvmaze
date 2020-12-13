import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  settings$ = new BehaviorSubject<Settings>({isNextWeek: false, countryCode: 'US', rating: 6});

  constructor() {
  }

  updateSettings(newSettings: Settings): void {
    this.settings$.next(newSettings);
  }
}
