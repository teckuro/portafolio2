import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BadgeComponent } from './ui/badge/badge.component';
import { SectionHeaderComponent } from './ui/section-header/section-header.component';
import {
  LucideAngularModule,
  ArrowRight,
  Menu,
  X,
  ExternalLink
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BadgeComponent,
    SectionHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      ArrowRight,
      Menu,
      X,
      ExternalLink
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
