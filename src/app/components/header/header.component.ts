import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() currentYear: number = new Date().getFullYear();
  @Input() availableYears: number[] = [];

  @Output() loadFakeData = new EventEmitter<void>();
  @Output() clearAllData = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() printAssessment = new EventEmitter<void>();
  @Output() yearChange = new EventEmitter<Event>();

  onLoadFakeData(): void {
    this.loadFakeData.emit();
  }

  onClearAllData(): void {
    this.clearAllData.emit();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onPrintAssessment(): void {
    this.printAssessment.emit();
  }

  onYearChange(event: Event): void {
    this.yearChange.emit(event);
  }
}
