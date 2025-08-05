import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AssessmentSectionComponent } from './components/assessment-section/assessment-section.component';
import { ScoringSidebarComponent } from './components/scoring-sidebar/scoring-sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AssessmentProgressComponent } from './components/assessment-progress/assessment-progress.component';

@Component({
  selector: 'app-root',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    CommonModule,
    AssessmentSectionComponent,
    ScoringSidebarComponent,
    HeaderComponent,
    AssessmentProgressComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Early Years Development Assessment';
  assessmentData: any = null;
  selectedScores: { [key: number]: string } = {};
  selectedTabIndex: number = 0;
  sidebarOpen: boolean = false;

  // Year tracking
  currentYear: number = new Date().getFullYear();
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  yearlyScores: { [year: number]: { [key: number]: string } } = {};
  expandedYears: { [year: number]: boolean } = {};

  // Color mapping for different sections
  sectionColors = {
    'Communication and interaction': {
      primary: '#2196F3',
      light: '#E3F2FD',
      hover: '#BBDEFB',
    },
    'Sensory and physical': {
      primary: '#FFC107',
      light: '#FFFBF0',
      hover: '#FFE082',
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
    this.initializeYears();
  }

  initializeYears() {
    // Initialize available years (current year + 2 previous years)
    this.availableYears = [
      this.currentYear,
      this.currentYear - 1,
      this.currentYear - 2,
    ];

    // Initialize empty scores for each year
    this.availableYears.forEach((year) => {
      this.yearlyScores[year] = {};
      this.expandedYears[year] = false; // Initialize accordion state
    });

    // Set selected scores to current year by default
    this.selectedScores = this.yearlyScores[this.selectedYear];
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
    this.yearlyScores[this.selectedYear][questionId] = score;
    console.log(
      `Question ${questionId} scored as: ${score} for year ${this.selectedYear}`
    );
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

  loadFakeData(): void {
    if (!this.assessmentData) return;

    // Clear existing data
    this.availableYears.forEach((year) => {
      this.yearlyScores[year] = {};
    });

    const scoreOptions = ['Emerging', 'Supported', 'Independent'];

    this.assessmentData.assessment_framework.sections.forEach(
      (section: any) => {
        section.subsections.forEach((subsection: any) => {
          subsection.questions.forEach((question: any) => {
            // Generate data for each year with different completion rates
            this.availableYears.forEach((year, yearIndex) => {
              let shouldHaveScore = false;

              if (year === this.currentYear) {
                // Current year: 50% completion rate
                shouldHaveScore = Math.random() < 0.5;
              } else {
                // Previous years: 100% completion rate (all questions answered)
                shouldHaveScore = true;
              }

              if (shouldHaveScore) {
                // Create realistic distribution with slight improvement over years
                const rand = Math.random();
                let score: string;

                if (year === this.currentYear) {
                  // Current year: more emerging/supported (30% Emerging, 45% Supported, 25% Independent)
                  if (rand < 0.3) {
                    score = 'Emerging';
                  } else if (rand < 0.75) {
                    score = 'Supported';
                  } else {
                    score = 'Independent';
                  }
                } else if (year === this.currentYear - 1) {
                  // Last year: balanced distribution (25% Emerging, 40% Supported, 35% Independent)
                  if (rand < 0.25) {
                    score = 'Emerging';
                  } else if (rand < 0.65) {
                    score = 'Supported';
                  } else {
                    score = 'Independent';
                  }
                } else {
                  // Two years ago: more independent (20% Emerging, 35% Supported, 45% Independent)
                  if (rand < 0.2) {
                    score = 'Emerging';
                  } else if (rand < 0.55) {
                    score = 'Supported';
                  } else {
                    score = 'Independent';
                  }
                }

                this.yearlyScores[year][question.id] = score;
              }
            });
          });
        });
      }
    );

    // Update current selected scores
    this.selectedScores = this.yearlyScores[this.selectedYear];

    const currentYearCount = Object.keys(
      this.yearlyScores[this.currentYear]
    ).length;
    const totalQuestions = this.getTotalQuestionsCount();

    console.log(`Fake assessment data loaded:`);
    console.log(
      `- ${
        this.currentYear
      } (current): ${currentYearCount}/${totalQuestions} questions (${Math.round(
        (currentYearCount / totalQuestions) * 100
      )}%)`
    );
    this.availableYears.slice(1).forEach((year) => {
      const count = Object.keys(this.yearlyScores[year]).length;
      console.log(
        `- ${year} (previous): ${count}/${totalQuestions} questions (${Math.round(
          (count / totalQuestions) * 100
        )}%) - Complete`
      );
    });
  }

  clearAllData(): void {
    // Clear all scores for all years
    this.availableYears.forEach((year) => {
      this.yearlyScores[year] = {};
    });

    // Reset selected scores to empty for current year
    this.selectedScores = {};

    // Reset expanded years accordion state
    this.availableYears.forEach((year) => {
      this.expandedYears[year] = false;
    });

    console.log(
      'All assessment data has been cleared. Starting fresh assessment.'
    );
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

  switchYear(year: number): void {
    this.selectedYear = year;
    this.selectedScores = this.yearlyScores[year];
    console.log(
      `Switched to year ${year}. Scores available: ${
        Object.keys(this.selectedScores).length
      }`
    );
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const year = parseInt(target.value, 10);
    this.switchYear(year);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getScoreValue(scoreLabel: string): number {
    const scoring = this.assessmentData?.assessment_framework?.scoring;
    if (!scoring) return 0;

    const scoreKey = Object.keys(scoring).find(
      (key) => scoring[key].label === scoreLabel
    );

    return scoreKey ? scoring[scoreKey].value : 0;
  }

  hasAnyScores(): boolean {
    return Object.keys(this.selectedScores).length > 0;
  }

  toggleYearDetails(year: number): void {
    this.expandedYears[year] = !this.expandedYears[year];
    // Also update the selected year to change the sidebar data
    this.switchYear(year);
  }

  onYearDetailsToggled(year: number): void {
    // Also update the selected year to change the sidebar data
    this.switchYear(year);
  }
}
