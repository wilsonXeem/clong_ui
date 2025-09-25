import { Component, OnInit } from '@angular/core';
import { Program, CreateProgramRequest } from '../../core/models/program.model';
import { ProgramService } from '../../core/services/program.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  loading = true;
  error: string | null = null;
  showCreateForm = false;
  editingProgram: Program | null = null;
  searchTerm = '';
  statusFilter = 'all';
  selectedPrograms: Set<string> = new Set();
  selectedFile: File | null = null;
  
  programForm: CreateProgramRequest = {
    title: '',
    description: '',
    imageUrl: '',
    targetAmount: 0,
    startDate: undefined,
    endDate: undefined,
    isActive: true
  };

  constructor(private programService: ProgramService) { }

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.loading = true;
    this.programService.getPrograms().subscribe({
      next: (response) => {
        this.programs = response.data.programs;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load programs';
        this.loading = false;
        console.error('Error loading programs:', error);
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingProgram = null;
    this.resetForm();
  }

  openEditForm(program: Program): void {
    this.showCreateForm = true;
    this.editingProgram = program;
    this.programForm = {
      title: program.title,
      description: program.description,
      imageUrl: program.imageUrl || '',
      targetAmount: program.targetAmount || 0,
      startDate: program.startDate,
      endDate: program.endDate,
      isActive: program.isActive
    };
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingProgram = null;
    this.resetForm();
  }

  resetForm(): void {
    this.programForm = {
      title: '',
      description: '',
      imageUrl: '',
      targetAmount: 0,
      startDate: undefined,
      endDate: undefined,
      isActive: true
    };
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.editingProgram) {
      this.updateProgram();
    } else {
      this.createProgram();
    }
  }

  createProgram(): void {
    const formData = new FormData();
    formData.append('title', this.programForm.title);
    formData.append('description', this.programForm.description);
    if (this.programForm.targetAmount) {
      formData.append('targetAmount', this.programForm.targetAmount.toString());
    }
    if (this.programForm.startDate) {
      formData.append('startDate', this.programForm.startDate.toString());
    }
    if (this.programForm.endDate) {
      formData.append('endDate', this.programForm.endDate.toString());
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.programService.createProgramWithFile(formData).subscribe({
      next: (response) => {
        this.programs.unshift(response.data.program);
        this.applyFilters();
        this.closeForm();
      },
      error: (error) => {
        console.error('Error creating program:', error);
        alert('Failed to create program');
      }
    });
  }

  updateProgram(): void {
    if (!this.editingProgram) return;
    
    this.programService.updateProgram(this.editingProgram.id, this.programForm).subscribe({
      next: (response) => {
        const index = this.programs.findIndex(p => p.id === this.editingProgram!.id);
        if (index !== -1) {
          this.programs[index] = response.data;
        }
        this.closeForm();
      },
      error: (error) => {
        console.error('Error updating program:', error);
        alert('Failed to update program');
      }
    });
  }

  deleteProgram(program: Program): void {
    if (confirm(`Are you sure you want to delete "${program.title}"?`)) {
      this.programService.deleteProgram(program.id).subscribe({
        next: () => {
          this.programs = this.programs.filter(p => p.id !== program.id);
        },
        error: (error) => {
          console.error('Error deleting program:', error);
          alert('Failed to delete program');
        }
      });
    }
  }

  getProgressPercentage(program: Program): number {
    if (!program.targetAmount || program.targetAmount === 0) return 0;
    return Math.min((program.currentAmount / program.targetAmount) * 100, 100);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  // Search and Filter Methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.programs];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(program => 
        program.title.toLowerCase().includes(term) ||
        program.description.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(program => program.isActive === isActive);
    }

    this.filteredPrograms = filtered;
  }

  // Selection Methods
  toggleProgramSelection(programId: string): void {
    if (this.selectedPrograms.has(programId)) {
      this.selectedPrograms.delete(programId);
    } else {
      this.selectedPrograms.add(programId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedPrograms.size === this.filteredPrograms.length) {
      this.selectedPrograms.clear();
    } else {
      this.selectedPrograms.clear();
      this.filteredPrograms.forEach(program => this.selectedPrograms.add(program.id));
    }
  }

  isSelected(programId: string): boolean {
    return this.selectedPrograms.has(programId);
  }

  get isAllSelected(): boolean {
    return this.filteredPrograms.length > 0 && this.selectedPrograms.size === this.filteredPrograms.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedPrograms.size > 0 && this.selectedPrograms.size < this.filteredPrograms.length;
  }

  // Bulk Operations
  bulkToggleStatus(): void {
    if (this.selectedPrograms.size === 0) return;

    const selectedProgramsList = this.programs.filter(p => this.selectedPrograms.has(p.id));
    const hasActivePrograms = selectedProgramsList.some(p => p.isActive);
    const newStatus = !hasActivePrograms;

    const updates = Array.from(this.selectedPrograms).map(id => 
      this.programService.updateProgram(id, { isActive: newStatus })
    );

    Promise.all(updates.map(obs => obs.toPromise()))
      .then(() => {
        selectedProgramsList.forEach(program => {
          const index = this.programs.findIndex(p => p.id === program.id);
          if (index !== -1) {
            this.programs[index].isActive = newStatus;
          }
        });
        this.selectedPrograms.clear();
        this.applyFilters();
      })
      .catch(error => {
        console.error('Error updating programs:', error);
        alert('Failed to update some programs');
      });
  }

  bulkDelete(): void {
    if (this.selectedPrograms.size === 0) return;

    const count = this.selectedPrograms.size;
    if (confirm(`Are you sure you want to delete ${count} selected program(s)?`)) {
      const deletions = Array.from(this.selectedPrograms).map(id => 
        this.programService.deleteProgram(id)
      );

      Promise.all(deletions.map(obs => obs.toPromise()))
        .then(() => {
          this.programs = this.programs.filter(p => !this.selectedPrograms.has(p.id));
          this.selectedPrograms.clear();
          this.applyFilters();
        })
        .catch(error => {
          console.error('Error deleting programs:', error);
          alert('Failed to delete some programs');
        });
    }
  }

  clearSelection(): void {
    this.selectedPrograms.clear();
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/placeholder.jpg';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
