import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>User Details</h2>
      <div mat-dialog-content>
        <div class="user-details">
          <div class="detail-row">
            <strong>Name:</strong> {{ data.firstName }} {{ data.lastName }}
          </div>
          <div class="detail-row">
            <strong>Email:</strong> {{ data.email }}
          </div>
          <div class="detail-row">
            <strong>Phone:</strong> {{ data.phone || 'N/A' }}
          </div>
          <div class="detail-row">
            <strong>Role:</strong> 
            <span class="badge badge-role" [class]="'badge-' + data.role">
              {{ data.role | titlecase }}
            </span>
          </div>
          <div class="detail-row">
            <strong>Status:</strong> 
            <span class="badge" [class]="data.isActive ? 'badge-success' : 'badge-danger'">
              {{ data.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="detail-row">
            <strong>Joined:</strong> {{ formatDate(data.createdAt) }}
          </div>
          <div class="detail-row">
            <strong>Last Updated:</strong> {{ formatDate(data.updatedAt) }}
          </div>
        </div>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .user-details {
      min-width: 400px;
      padding: 20px 0;
    }
    .detail-row {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge-success {
      background: #d4edda;
      color: #155724;
    }
    .badge-danger {
      background: #f8d7da;
      color: #721c24;
    }
    .badge-admin {
      background: #d1ecf1;
      color: #0c5460;
    }
    .badge-user {
      background: #e2e3e5;
      color: #383d41;
    }
  `]
})
export class UserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}