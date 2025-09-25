import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedRole = '';
  filteredUsers: User[] = [];
  selectedUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.filteredUsers = [...this.users];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  onSearchChange(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  getUniqueRoles(): string[] {
    return [...new Set(this.users.map(user => user.role))];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getUserStatusClass(user: User): string {
    return user.isActive ? 'badge-success' : 'badge-danger';
  }

  getUserStatusText(user: User): string {
    return user.isActive ? 'Active' : 'Inactive';
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  viewUser(user: User): void {
    this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user
    });
  }

  editUser(user: User): void {
    // Edit functionality can be implemented as a separate dialog if needed
    console.log('Edit user:', user);
  }

  confirmDelete(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      this.deleteUser(user.id);
    }
  }





  toggleUserStatus(user: User): void {
    this.loading = true;
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          const userIndex = this.users.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...response.data };
            this.filterUsers();
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to toggle user status';
        this.loading = false;
        console.error('Error toggling user status:', error);
      }
    });
  }

  deleteUser(userId: string): void {
    this.loading = true;
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = this.users.filter(u => u.id !== userId);
          this.filterUsers();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete user';
        this.loading = false;
        console.error('Error deleting user:', error);
      }
    });
  }


}
