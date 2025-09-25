import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() imageUrl?: string;
  @Input() date?: Date;
  @Input() author?: string;
  @Input() buttonText?: string;
  @Input() clickable = false;
  
  @Output() cardClick = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<void>();

  onCardClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }

  onButtonClick(event: Event): void {
    event.stopPropagation();
    this.buttonClick.emit();
  }
}
