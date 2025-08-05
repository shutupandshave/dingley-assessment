import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assessment-progress',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './assessment-progress.component.html',
  styleUrl: './assessment-progress.component.scss',
})
export class AssessmentProgressComponent {
  @Input() assessmentData: any;
  @Input() availableYears: number[] = [];
  @Input() currentYear: number = new Date().getFullYear();
  @Input() yearlyScores: { [year: number]: { [key: number]: string } } = {};
  @Input() expandedYears: { [year: number]: boolean } = {};
  @Input() sectionColors: any = {};

  @Output() yearDetailsToggled = new EventEmitter<number>();

  toggleYearDetails(year: number): void {
    this.expandedYears[year] = !this.expandedYears[year];
    this.yearDetailsToggled.emit(year);
  }

  getYearCompletionCount(year: number): number {
    return Object.keys(this.yearlyScores[year] || {}).length;
  }

  getTotalQuestionsCount(): number {
    if (!this.assessmentData) return 0;

    let totalQuestions = 0;
    this.assessmentData.assessment_framework.sections.forEach(
      (section: any) => {
        section.subsections.forEach((subsection: any) => {
          totalQuestions += subsection.questions.length;
        });
      }
    );

    return totalQuestions;
  }

  getYearCompletionPercentage(year: number): number {
    const completed = this.getYearCompletionCount(year);
    const total = this.getTotalQuestionsCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getYearTotalScore(year: number): {
    current: number;
    total: number;
    percentage: number;
  } {
    if (!this.assessmentData) return { current: 0, total: 0, percentage: 0 };

    let answeredQuestions = 0;
    let totalQuestions = 0;
    const yearScores = this.yearlyScores[year] || {};

    this.assessmentData.assessment_framework.sections.forEach(
      (section: any) => {
        section.subsections.forEach((subsection: any) => {
          subsection.questions.forEach((question: any) => {
            totalQuestions++;
            const selectedScore = yearScores[question.id];
            if (selectedScore) {
              answeredQuestions++;
            }
          });
        });
      }
    );

    const percentage =
      totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0;

    return { current: answeredQuestions, total: totalQuestions, percentage };
  }

  getYearSectionScore(
    year: number,
    sectionTitle: string
  ): { current: number; total: number; percentage: number } {
    if (!this.assessmentData) return { current: 0, total: 0, percentage: 0 };

    const section = this.assessmentData.assessment_framework.sections.find(
      (s: any) => s.title === sectionTitle
    );

    if (!section) return { current: 0, total: 0, percentage: 0 };

    let currentScore = 0;
    let totalQuestions = 0;
    const yearScores = this.yearlyScores[year] || {};

    section.subsections.forEach((subsection: any) => {
      subsection.questions.forEach((question: any) => {
        totalQuestions++;
        const selectedScore = yearScores[question.id];
        if (selectedScore) {
          const scoreValue = this.getScoreValue(selectedScore);
          currentScore += scoreValue;
        }
      });
    });

    const maxPossibleScore = totalQuestions * 3;
    const percentage =
      maxPossibleScore > 0
        ? Math.round((currentScore / maxPossibleScore) * 100)
        : 0;

    return { current: currentScore, total: maxPossibleScore, percentage };
  }

  getSectionColor(sectionTitle: string): string {
    const colors =
      this.sectionColors[sectionTitle as keyof typeof this.sectionColors];
    return colors ? colors.primary : '#1976d2';
  }

  private getScoreValue(scoreLabel: string): number {
    const scoring = this.assessmentData?.assessment_framework?.scoring;
    if (!scoring) return 0;

    const scoreKey = Object.keys(scoring).find(
      (key) => scoring[key].label === scoreLabel
    );

    return scoreKey ? scoring[scoreKey].value : 0;
  }
}
