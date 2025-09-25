import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.successMessage = 'Account created successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}