import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkillCardComponent } from './components/skill-card/skill-card.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { BadgeComponent } from './ui/badge/badge.component';
import { GlowCardComponent } from './ui/glow-card/glow-card.component';
import { SectionHeaderComponent } from './ui/section-header/section-header.component';
import {
  LucideAngularModule,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ArrowRight,
  Download,
  Code2,
  Menu,
  X,
  FileCode,
  LayoutGrid,
  Database,
  Server,
  FileText,
  GitBranch,
  Layers,
  Cpu,
  ShoppingCart,
  Globe,
  CircleCheck,
  Send,
  GraduationCap,
  Star,
  BookOpen,
  ChevronDown,
  Terminal,
  Github,
  ExternalLink,
  Maximize2,
  Circle,
  AlertCircle,
  Lightbulb,
  Minus,
  ChevronRight,
  Award,
  CheckCircle2,
  Linkedin,
  MessageCircle
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SkillCardComponent,
    ProjectCardComponent,
    BadgeComponent,
    GlowCardComponent,
    SectionHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      Mail,
      Phone,
      MapPin,
      Briefcase,
      ArrowRight,
      Download,
      Code2,
      Menu,
      X,
      FileCode,
      LayoutGrid,
      Database,
      Server,
      FileText,
      GitBranch,
      Layers,
      Cpu,
      ShoppingCart,
      Globe,
      CircleCheck,
      Send,
      GraduationCap,
      Star,
      BookOpen,
      ChevronDown,
      Terminal,
      Github,
      ExternalLink,
      Maximize2,
      Circle,
      AlertCircle,
      Lightbulb,
      Minus,
      ChevronRight,
      Award,
      CheckCircle2,
      Linkedin,
      MessageCircle
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
