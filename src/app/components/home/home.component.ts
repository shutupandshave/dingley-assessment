import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AssessmentProgressComponent } from '../assessment-progress/assessment-progress.component';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, CommonModule, AssessmentProgressComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @Input() assessmentData: any;
  @Input() selectedScores: { [key: number]: string } = {};
  @Input() availableYears: number[] = [];
  @Input() currentYear: number = new Date().getFullYear();
  @Input() yearlyScores: { [year: number]: { [key: number]: string } } = {};
  @Input() expandedYears: { [year: number]: boolean } = {};
  @Input() sectionColors: any = {};

  @Output() navigateToSection = new EventEmitter<number>();
  @Output() yearDetailsToggled = new EventEmitter<number>();

  getTotalQuestions(section: any): number {
    return section.subsections.reduce((total: number, subsection: any) => {
      return total + subsection.questions.length;
    }, 0);
  }

  getScoreValues(): any[] {
    if (!this.assessmentData) return [];
    const scoring = this.assessmentData.assessment_framework.scoring;
    return Object.keys(scoring).map((key) => scoring[key]);
  }

  getSectionColor(
    sectionTitle: string,
    colorType: 'primary' | 'light' | 'hover' = 'primary'
  ): string {
    const colors =
      this.sectionColors[sectionTitle as keyof typeof this.sectionColors];
    return colors ? colors[colorType] : '#1976d2';
  }

  hasAnyScores(): boolean {
    return Object.keys(this.selectedScores).length > 0;
  }

  onNavigateToSection(index: number): void {
    this.navigateToSection.emit(index);
  }

  onYearDetailsToggled(year: number): void {
    this.yearDetailsToggled.emit(year);
  }
}
