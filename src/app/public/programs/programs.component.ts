import { Component, OnInit } from '@angular/core';
import { Program } from '../../core/models/program.model';
import { ProgramService } from '../../core/services/program.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  programs: Program[] = [];
  loading = true;
  error: string | null = null;

  constructor(private programService: ProgramService) { }

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getPrograms({ isActive: true }).subscribe({
      next: (response) => {
        this.programs = response.data.programs;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load programs';
        this.loading = false;
        console.error('Error loading programs:', error);
      }
    });
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

  isUpcoming(program: Program): boolean {
    if (!program.startDate) return false;
    return new Date(program.startDate) > new Date();
  }

  isActive(program: Program): boolean {
    const now = new Date();
    const start = program.startDate ? new Date(program.startDate) : null;
    const end = program.endDate ? new Date(program.endDate) : null;
    
    if (start && end) {
      return now >= start && now <= end;
    }
    return program.isActive;
  }

  shareProgram(program: Program): void {
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: program.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const shareText = `${program.title} - ${program.description}\n\nLearn more: ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Program details copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  }
}
