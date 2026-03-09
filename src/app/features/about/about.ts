import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
})
export class AboutComponent {}
