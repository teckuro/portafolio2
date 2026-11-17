
import { Component } from '@angular/core';
import { SiteContent } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';

@Component({
  imports: [],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private readonly language: LanguageService) {}

  get content(): SiteContent {
    return this.language.content;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
