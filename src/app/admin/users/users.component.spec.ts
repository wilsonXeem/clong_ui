import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UsersComponent } from './users.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'user@test.com',
      firstName: 'Regular',
      lastName: 'User',
      phone: '0987654321',
      role: 'user',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAllUsers']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['updateUserRole', 'toggleUserStatus', 'deleteUser']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockAuthService.getAllUsers.and.returnValue(of({ success: true, data: mockUsers }));
    
    component.ngOnInit();
    
    expect(mockAuthService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
  });

  it('should handle error when loading users', () => {
    mockAuthService.getAllUsers.and.returnValue(throwError('Error'));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Failed to load users');
    expect(component.loading).toBeFalse();
  });

  it('should filter users by search term', () => {
    component.users = mockUsers;
    component.searchTerm = 'admin';
    
    component.filterUsers();
    
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].email).toBe('admin@test.com');
  });

  it('should filter users by role', () => {
    component.users = mockUsers;
    component.selectedRole = 'admin';
    
    component.filterUsers();
    
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].role).toBe('admin');
  });

  it('should get unique roles', () => {
    component.users = mockUsers;
    
    const roles = component.getUniqueRoles();
    
    expect(roles).toEqual(['admin', 'user']);
  });

  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    
    const formatted = component.formatDate(date);
    
    expect(formatted).toBe('1/1/2023');
  });

  it('should get correct status class', () => {
    expect(component.getUserStatusClass(mockUsers[0])).toBe('badge-success');
    expect(component.getUserStatusClass(mockUsers[1])).toBe('badge-danger');
  });

  it('should get correct status text', () => {
    expect(component.getUserStatusText(mockUsers[0])).toBe('Active');
    expect(component.getUserStatusText(mockUsers[1])).toBe('Inactive');
  });

  it('should open user modal', () => {
    component.viewUser(mockUsers[0]);
    
    expect(component.selectedUser).toBe(mockUsers[0]);
    expect(component.showUserModal).toBeTrue();
  });

  it('should open edit modal with user data', () => {
    component.editUser(mockUsers[0]);
    
    expect(component.selectedUser).toBe(mockUsers[0]);
    expect(component.showEditModal).toBeTrue();
    expect(component.editForm.role).toBe(mockUsers[0].role);
  });

  it('should close all modals', () => {
    component.showUserModal = true;
    component.showEditModal = true;
    component.showDeleteModal = true;
    component.selectedUser = mockUsers[0];
    
    component.closeModals();
    
    expect(component.showUserModal).toBeFalse();
    expect(component.showEditModal).toBeFalse();
    expect(component.showDeleteModal).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('should save user changes', () => {
    component.selectedUser = mockUsers[0];
    component.editForm.role = 'user';
    mockUserService.updateUserRole.and.returnValue(of({ success: true, message: 'Updated', data: { ...mockUsers[0], role: 'user' } }));
    
    component.saveUserChanges();
    
    expect(mockUserService.updateUserRole).toHaveBeenCalledWith(mockUsers[0].id, 'user');
  });

  it('should toggle user status', () => {
    component.users = [...mockUsers];
    const updatedUser = { ...mockUsers[0], isActive: false };
    mockUserService.toggleUserStatus.and.returnValue(of({ success: true, message: 'Updated', data: updatedUser }));
    
    component.toggleUserStatus(mockUsers[0]);
    
    expect(mockUserService.toggleUserStatus).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('should delete user', () => {
    component.users = [...mockUsers];
    component.selectedUser = mockUsers[0];
    mockUserService.deleteUser.and.returnValue(of({ success: true, message: 'Deleted', data: { id: mockUsers[0].id, email: mockUsers[0].email } }));
    
    component.deleteUser();
    
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
    expect(component.users.length).toBe(1);
  });
});