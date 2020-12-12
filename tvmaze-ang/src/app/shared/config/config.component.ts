import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfigService} from './config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly configService: ConfigService,
  ) {
    this.form = this.fb.group({
        week: fb.control('current'),
        countryCode: fb.control('US'),
        rating: fb.control('6'),
      }
    );

    // todo debounceTime?
    this.form.valueChanges.subscribe(({week, countryCode, rating}) =>
      this.configService.updateSettings({
        isNextWeek: week === 'next',
        countryCode,
        rating: Number(rating)
      })
    );
  }

  ngOnInit(): void {
  }
}
