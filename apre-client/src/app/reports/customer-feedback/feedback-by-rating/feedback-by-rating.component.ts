import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feedback-by-rating',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Customer Feedback By Rating</h1>
    <div class="rating-container">
      <form class="form" [formGroup]="ratingForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="rating">Rating<span class="required">*</span></label>
          <select class="select" formControlName="rating" id="rating" name="rating">
            <option [ngValue]="null" [disabled]="true">Select rating</option>
            @for(rating of ratings; track rating) {
              <option value="{{ rating }}">{{ rating }}</option>
            }
          </select>
        </div>

        <div class="form__actions">
          <button class="button button--primary" type="submit" title="Click to fetch Data">Get Data</button>
        </div>
      </form>

      <br />
      @if (showChart) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Customer Feedback'"
            [data]="performanceMetrics"
            [labels]="salespeople">
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: `
    .rating-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `
})
export class FeedbackByRatingComponent implements AfterViewInit {
  ratings: string[] = []; // Initially empty
  performanceMetrics: number[] = []; // Initially empty
  salespeople: string[] = []; // Initially empty
  showChart: boolean = false; // Initially hidden

  ratingForm = this.fb.group({
    rating: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // Query to get the ratings
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-rating`).subscribe({
      next: (data: any) => {
        this.ratings = data;
      },
      error: (err) => {
        console.error('Error fetching ratings:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // No need to create chart here, it will be handled by ChartComponent
  }

  onSubmit() {
    // Get the value ​​of the field in the form
    const rating = this.ratingForm.controls['rating'].value;
    console.log(rating);

    // Check if there is any value in the rating field
    if(rating) {
      // Query that finds sales associated with the obtained rating
      this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-rating/${rating}`).subscribe({
        next: (data: any) => {
          // Set the values obtained
          console.log("data: ", data);
          this.performanceMetrics = data[0].performanceMetrics;
          this.salespeople = data[0].salespeople;

          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error fetching customer feedback by rating data:', error);
        },
        complete: () => {
          this.showChart = true; // Show chart after fetching data
        }
      });
    } else {
      // If there is no value in the rating field, an alert is generated to prompt the user to select one.
      alert('Please select a rating.');
    }
  }

}
