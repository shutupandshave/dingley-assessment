import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AssessmentSectionComponent } from './components/assessment-section/assessment-section.component';

@Component({
  selector: 'app-root',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    AssessmentSectionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Early Years Development Assessment';
  assessmentData: any = null;
  selectedScores: { [key: number]: string } = {};
  selectedTabIndex: number = 0;

  // Color mapping for different sections
  sectionColors = {
    'Communication and interaction': {
      primary: '#2196F3',
      light: '#E3F2FD',
      hover: '#BBDEFB',
    },
    'Sensory and physical': {
      primary: '#FF5722',
      light: '#FFF3E0',
      hover: '#FFCCBC',
    },
    'Social and emotional': {
      primary: '#9C27B0',
      light: '#F3E5F5',
      hover: '#E1BEE7',
    },
    'Cognition and learning': {
      primary: '#4CAF50',
      light: '#E8F5E8',
      hover: '#C8E6C9',
    },
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAssessmentData();
  }

  loadAssessmentData() {
    // Load from public folder
    this.http.get('/questions.json').subscribe({
      next: (data) => {
        this.assessmentData = data;
        console.log('Assessment data loaded successfully:', data);
        this.logSensoryPhysicalData();
      },
      error: (error) => {
        console.error('Error loading assessment data:', error);
      },
    });
  }

  logSensoryPhysicalData() {
    if (this.assessmentData) {
      const sensorySection =
        this.assessmentData.assessment_framework.sections.find(
          (s: any) => s.title === 'Sensory and physical'
        );
      if (sensorySection) {
        console.log('Sensory and physical section:', sensorySection);
        sensorySection.subsections.forEach((subsection: any) => {
          console.log(
            `${subsection.title}: ${subsection.questions.length} questions`
          );
          console.log('Questions:', subsection.questions);
        });
      }
    }
  }

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

  selectScore(questionId: number, score: string) {
    this.selectedScores[questionId] = score;
    console.log(`Question ${questionId} scored as: ${score}`);
  }

  onScoreSelected(event: { questionId: number; score: string }) {
    this.selectScore(event.questionId, event.score);
  }

  getSelectedScore(questionId: number): string {
    return this.selectedScores[questionId] || '';
  }

  navigateToSection(sectionIndex: number) {
    // Tab index is sectionIndex + 1 because index 0 is the "Home" tab
    this.selectedTabIndex = sectionIndex + 1;
  }

  getSectionColor(
    sectionTitle: string,
    colorType: 'primary' | 'light' | 'hover' = 'primary'
  ): string {
    const colors =
      this.sectionColors[sectionTitle as keyof typeof this.sectionColors];
    return colors ? colors[colorType] : '#1976d2';
  }

  getCurrentTabColor(): string {
    if (this.selectedTabIndex === 0 || !this.assessmentData) {
      return '#f5f5f5'; // Default home tab color
    }

    const sectionIndex = this.selectedTabIndex - 1;
    const section =
      this.assessmentData.assessment_framework.sections[sectionIndex];
    return section ? this.getSectionColor(section.title, 'light') : '#f5f5f5';
  }

  printAssessment(): void {
    window.print();
  }
}
