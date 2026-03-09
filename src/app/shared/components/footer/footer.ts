import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../../core/services/consent';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected consent = inject(ConsentService);
  protected currentYear = new Date().getFullYear();
}
