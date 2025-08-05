import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-scoring-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './scoring-sidebar.component.html',
  styleUrl: './scoring-sidebar.component.scss',
})
export class ScoringSidebarComponent {
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() currentYear: number = new Date().getFullYear();
  @Input() assessmentData: any = null;
  @Input() selectedTabIndex: number = 0;
  @Input() scoreValues: any[] = [];
  @Input() selectedScores: { [key: number]: string } = {};
  @Input() sectionColors: any = {};

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  getTotalScore(): { current: number; total: number; percentage: number } {
    if (!this.assessmentData) return { current: 0, total: 0, percentage: 0 };

    let answeredQuestions = 0;
    let totalQuestions = 0;

    this.assessmentData.assessment_framework.sections.forEach(
      (section: any) => {
        section.subsections.forEach((subsection: any) => {
          subsection.questions.forEach((question: any) => {
            totalQuestions++;
            const selectedScore = this.selectedScores[question.id];
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

  getSectionScore(sectionTitle: string): {
    current: number;
    total: number;
    percentage: number;
  } {
    if (!this.assessmentData) return { current: 0, total: 0, percentage: 0 };

    const section = this.assessmentData.assessment_framework.sections.find(
      (s: any) => s.title === sectionTitle
    );

    if (!section) return { current: 0, total: 0, percentage: 0 };

    let currentScore = 0;
    let totalQuestions = 0;

    section.subsections.forEach((subsection: any) => {
      subsection.questions.forEach((question: any) => {
        totalQuestions++;
        const selectedScore = this.selectedScores[question.id];
        if (selectedScore) {
          const scoreValue = this.getScoreValue(selectedScore);
          currentScore += scoreValue;
        }
      });
    });

    const maxPossibleScore = totalQuestions * 3; // Maximum score is 3 per question
    const percentage =
      maxPossibleScore > 0
        ? Math.round((currentScore / maxPossibleScore) * 100)
        : 0;

    return { current: currentScore, total: maxPossibleScore, percentage };
  }

  getSubsectionScore(
    sectionTitle: string,
    subsectionTitle: string
  ): { current: number; total: number; percentage: number } {
    if (!this.assessmentData) return { current: 0, total: 0, percentage: 0 };

    const section = this.assessmentData.assessment_framework.sections.find(
      (s: any) => s.title === sectionTitle
    );

    if (!section) return { current: 0, total: 0, percentage: 0 };

    const subsection = section.subsections.find(
      (sub: any) => sub.title === subsectionTitle
    );

    if (!subsection) return { current: 0, total: 0, percentage: 0 };

    let currentScore = 0;
    const totalQuestions = subsection.questions.length;

    subsection.questions.forEach((question: any) => {
      const selectedScore = this.selectedScores[question.id];
      if (selectedScore) {
        const scoreValue = this.getScoreValue(selectedScore);
        currentScore += scoreValue;
      }
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

  getCurrentSectionTitle(): string {
    if (!this.assessmentData || this.selectedTabIndex === 0) return '';

    const sectionIndex = this.selectedTabIndex - 1;
    const section =
      this.assessmentData.assessment_framework.sections[sectionIndex];

    return section ? section.title : '';
  }

  getCurrentSectionSubsections(): any[] {
    if (!this.assessmentData || this.selectedTabIndex === 0) return [];

    const sectionIndex = this.selectedTabIndex - 1;
    const section =
      this.assessmentData.assessment_framework.sections[sectionIndex];

    return section ? section.subsections : [];
  }

  getScoreValue(scoreLabel: string): number {
    const scoring = this.assessmentData?.assessment_framework?.scoring;
    if (!scoring) return 0;

    const scoreKey = Object.keys(scoring).find(
      (key) => scoring[key].label === scoreLabel
    );

    return scoreKey ? scoring[scoreKey].value : 0;
  }

  getScoreDistribution(): { [key: string]: number } {
    const distribution = { Emerging: 0, Supported: 0, Independent: 0 };

    Object.values(this.selectedScores).forEach((score: string) => {
      if (distribution.hasOwnProperty(score)) {
        distribution[score as keyof typeof distribution]++;
      }
    });

    return distribution;
  }
}
