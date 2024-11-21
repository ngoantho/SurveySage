import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveylistComponent } from './surveylist.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';

describe('SurveylistComponent', () => {
  let component: SurveylistComponent;
  let fixture: ComponentFixture<SurveylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveylistComponent],
      imports: [
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if the toolbar is rendered
  it('should render the toolbar', () => {
    const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbar).toBeTruthy();
  });

  // Check if the table is rendered
  it('should render the table', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  // Check if the table contains the correct columns
  it('should have correct table column headers', () => {
    const headerCells = fixture.debugElement.queryAll(By.css('th.mat-header-cell'));
    const columnHeaders = headerCells.map((header) => header.nativeElement.textContent.trim());
    expect(columnHeaders).toEqual(['Name', 'Description', 'Status', 'Owner']);
  });

  // Test the click event of the Back button
  it('should call clickEvent when Back button is clicked', () => {
    spyOn(component, 'clickEvent');
    const button = fixture.debugElement.query(By.css('button[color="primary"]')).nativeElement;
    button.click();
    expect(component.clickEvent).toHaveBeenCalled();
  });

  // Check if the dataSource is defined
  it('should have a defined dataSource', () => {
    expect(component.dataSource).toBeDefined();
  });

  // Check if router links are present
  it('should have router links for survey names', () => {
    const links = fixture.debugElement.queryAll(By.css('a[routerLink]'));
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.attributes['routerLink']).toBeTruthy();
    });
  });
});
