import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.showSuccess = false;
    this.showError = false;

    this.contactService.sendMessage(this.formData).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = error.error?.message || 'Failed to send message. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
