import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackByRatingComponent } from './feedback-by-rating.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeedbackByRatingComponent', () => {
  let component: FeedbackByRatingComponent;
  let fixture: ComponentFixture<FeedbackByRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FeedbackByRatingComponent] // Import FeedbackByRatingComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackByRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the title "Customer Feedback By Rating" is displayed.
  it('should display the title "Customer Feedback By Rating"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback By Rating');
  });

  // Test that the supervisorForm is initialized with null values.
  it('should initialize the ratingForm with a null value', () => {
    const monthControl = component.ratingForm.controls['rating'];
    expect(monthControl.value).toBeNull();
    expect(monthControl.valid).toBeFalse();
  });

  // Test that the form should not be submit if no rating has been selected.
  it('should not submit the form if no rating is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.ratingForm.valid).toBeFalse();
  });
});
