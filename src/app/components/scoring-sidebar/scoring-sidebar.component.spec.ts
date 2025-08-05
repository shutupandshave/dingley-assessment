import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScoringSidebarComponent } from './scoring-sidebar.component';

describe('ScoringSidebarComponent', () => {
  let component: ScoringSidebarComponent;
  let fixture: ComponentFixture<ScoringSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringSidebarComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoringSidebarComponent);
    component = fixture.componentInstance;

    // Mock assessment data
    component.assessmentData = {
      assessment_framework: {
        sections: [
          {
            title: 'Test Section',
            subsections: [
              {
                title: 'Test Subsection',
                questions: [
                  { id: 1, text: 'Test question 1' },
                  { id: 2, text: 'Test question 2' },
                ],
              },
            ],
          },
        ],
        scoring: {
          emerging: { label: 'Emerging', value: 1, description: 'Test' },
          supported: { label: 'Supported', value: 2, description: 'Test' },
          independent: { label: 'Independent', value: 3, description: 'Test' },
        },
      },
    };

    component.scoreValues = [
      { label: 'Emerging', value: 1, description: 'Test' },
      { label: 'Supported', value: 2, description: 'Test' },
      { label: 'Independent', value: 3, description: 'Test' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar when close button is clicked', () => {
    spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  it('should calculate total score correctly', () => {
    component.selectedScores = { 1: 'Emerging', 2: 'Supported' };
    const totalScore = component.getTotalScore();
    expect(totalScore.current).toBe(2);
    expect(totalScore.total).toBe(2);
    expect(totalScore.percentage).toBe(100);
  });

  it('should calculate section score correctly', () => {
    component.selectedScores = { 1: 'Emerging', 2: 'Independent' };
    const sectionScore = component.getSectionScore('Test Section');
    expect(sectionScore.current).toBe(4); // 1 + 3
    expect(sectionScore.total).toBe(6); // 2 questions * 3 max points
    expect(sectionScore.percentage).toBe(67); // 4/6 * 100 rounded
  });

  it('should return empty string for section title when on home tab', () => {
    component.selectedTabIndex = 0;
    expect(component.getCurrentSectionTitle()).toBe('');
  });

  it('should return correct section title for non-home tab', () => {
    component.selectedTabIndex = 1;
    expect(component.getCurrentSectionTitle()).toBe('Test Section');
  });
});
