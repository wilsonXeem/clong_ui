import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonationService } from '../../core/services/donation.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  donationForm: FormGroup;
  presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000];
  selectedAmount: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    public authService: AuthService
  ) {
    this.donationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(100)]],
      donorName: ['', Validators.required],
      donorEmail: ['', [Validators.required, Validators.email]],
      isAnonymous: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      this.donationForm.patchValue({
        donorName: `${user?.firstName} ${user?.lastName}`,
        donorEmail: user?.email
      });
    }
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.donationForm.patchValue({ amount });
  }

  onCustomAmountChange(event: any): void {
    const value = parseInt(event.target.value);
    if (value && !this.presetAmounts.includes(value)) {
      this.selectedAmount = null;
    }
  }

  onSubmit(): void {
    if (this.donationForm.valid) {
      this.isLoading = true;
      const formData = this.donationForm.value;
      
      this.donationService.createDonation({
        ...formData,
        userId: this.authService.getCurrentUser()?.id
      }).subscribe({
        next: (response) => {
          console.log('Donation created:', response);
          // Integrate with payment gateway here
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Donation error:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
