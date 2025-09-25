import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VolunteerService } from '../../core/services/volunteer.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit {
  volunteerForm: FormGroup;
  isSubmitting = false;
  hasExistingApplication = false;
  existingApplication: any = null;
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.volunteerForm = this.fb.group({
      skills: ['', [Validators.required, Validators.minLength(10)]],
      availability: ['', [Validators.required, Validators.minLength(5)]],
      interests: ['', [Validators.required, Validators.minLength(10)]],
      experience: [''],
      motivation: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.checkExistingApplication();
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  checkExistingApplication(): void {
    if (this.isLoggedIn) {
      this.volunteerService.getUserVolunteerApplication().subscribe({
        next: (response) => {
          this.hasExistingApplication = true;
          this.existingApplication = response.data.volunteer;
        },
        error: () => {
          this.hasExistingApplication = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.volunteerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.volunteerService.applyVolunteer(this.volunteerForm.value).subscribe({
        next: (response) => {
          alert('Volunteer application submitted successfully!');
          this.checkExistingApplication();
          this.isSubmitting = false;
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to submit application');
          this.isSubmitting = false;
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'active': return '#007bff';
      default: return '#ffc107';
    }
  }
}
