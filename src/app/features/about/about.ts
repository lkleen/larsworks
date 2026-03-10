import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation';

@Component({
  selector: 'app-about',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
})
export class AboutComponent {
  private readonly i18n = inject(TranslationService);

  protected readonly title = this.i18n.t('about.title');
  protected readonly intro = this.i18n.t('about.intro');
  protected readonly more = this.i18n.t('about.more');
}
