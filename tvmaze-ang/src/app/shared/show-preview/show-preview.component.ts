import {Component, Input, OnInit} from '@angular/core';
import {ShowPreview} from '../../types';

@Component({
  selector: 'app-show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {
  airing = '';

  constructor() {
  }

  @Input() show?: ShowPreview;

  ngOnInit(): void {
    if (this.show && this.show.airdate) {
      this.airing = `${this.show.airdate.slice(5, 10).replace('-', '/')} ${this.show.airtime}`;
    }
  }
}
