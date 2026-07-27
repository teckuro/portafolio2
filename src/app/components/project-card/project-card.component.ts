import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  @Input() index = 1;
  @Input() title = '';
  @Input() stack = '';
  @Input() description = '';
  @Input() impact: string[] = [];
}
