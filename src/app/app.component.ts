import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Early Years Development Assessment';
  assessmentData: any = null;
  selectedScores: { [key: number]: string } = {};

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
      }
    });
  }

  logSensoryPhysicalData() {
    if (this.assessmentData) {
      const sensorySection = this.assessmentData.assessment_framework.sections.find((s: any) => s.title === 'Sensory and physical');
      if (sensorySection) {
        console.log('Sensory and physical section:', sensorySection);
        sensorySection.subsections.forEach((subsection: any) => {
          console.log(`${subsection.title}: ${subsection.questions.length} questions`);
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
    return Object.keys(scoring).map(key => scoring[key]);
  }

  selectScore(questionId: number, score: string) {
    this.selectedScores[questionId] = score;
    console.log(`Question ${questionId} scored as: ${score}`);
  }

  getSelectedScore(questionId: number): string {
    return this.selectedScores[questionId] || '';
  }

  isScoreSelected(questionId: number, score: string): boolean {
    return this.selectedScores[questionId] === score;
  }
}
