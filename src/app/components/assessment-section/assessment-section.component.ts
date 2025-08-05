import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessment-section',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    CommonModule,
  ],
  templateUrl: './assessment-section.component.html',
  styleUrl: './assessment-section.component.scss',
})
export class AssessmentSectionComponent {
  @Input() section: any = null;
  @Input() scoreValues: any[] = [];
  @Input() selectedScores: { [key: number]: string } = {};
  @Input() sectionColors: any = {};

  @Output() scoreSelected = new EventEmitter<{
    questionId: number;
    score: string;
  }>();

  @ViewChildren(MatExpansionPanel)
  expansionPanels!: QueryList<MatExpansionPanel>;

  allExpanded: boolean = true;

  // Score color mapping
  scoreColors = {
    Emerging: {
      primary: '#f44336',
      light: '#ffebee',
    },
    Supported: {
      primary: '#ffc107',
      light: '#fffbf0',
    },
    Independent: {
      primary: '#4caf50',
      light: '#e8f5e8',
    },
  };

  selectScore(questionId: number, score: string) {
    this.scoreSelected.emit({ questionId, score });
  }

  isScoreSelected(questionId: number, score: string): boolean {
    return this.selectedScores[questionId] === score;
  }

  getSectionColor(
    colorType: 'primary' | 'light' | 'hover' = 'primary'
  ): string {
    if (!this.section || !this.sectionColors[this.section.title]) {
      return colorType === 'primary' ? '#2e7d32' : '#e8f5e8';
    }
    return this.sectionColors[this.section.title][colorType];
  }

  getQuestionBackgroundColor(questionId: number): string {
    const selectedScore = this.selectedScores[questionId];
    if (!selectedScore) {
      return '#fafafa'; // Default background
    }

    const scoreColor =
      this.scoreColors[selectedScore as keyof typeof this.scoreColors];
    return scoreColor ? scoreColor.light : '#fafafa';
  }

  toggleAllPanels(expanded?: boolean): void {
    if (expanded === undefined) {
      this.allExpanded = !this.allExpanded;
    } else {
      this.allExpanded = expanded;
    }

    if (this.expansionPanels) {
      this.expansionPanels.forEach((panel) => {
        if (this.allExpanded) {
          panel.open();
        } else {
          panel.close();
        }
      });
    }
  }
}
