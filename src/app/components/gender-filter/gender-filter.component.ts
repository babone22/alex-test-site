import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GenderFilter = 'all' | 'boy' | 'girl';

@Component({
  selector: 'app-gender-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gender-filter">
      <h3>Filtrează după gen</h3>
      <div class="filter-buttons">
        <button 
          *ngFor="let option of filterOptions" 
          [class.active]="selectedFilter === option.value"
          (click)="onFilterChange(option.value)"
          class="filter-btn">
          <span class="icon">{{ option.icon }}</span>
          {{ option.label }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gender-filter {
      margin: 20px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .gender-filter h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 18px;
    }

    .filter-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .filter-btn:hover {
      border-color: #007bff;
      background: #f0f8ff;
    }

    .filter-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .filter-btn.active:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    .icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .filter-buttons {
        flex-direction: column;
      }
      
      .filter-btn {
        justify-content: center;
      }
    }
  `]
})
export class GenderFilterComponent {
  @Input() selectedFilter: GenderFilter = 'all';
  @Output() filterChange = new EventEmitter<GenderFilter>();

  filterOptions: { value: GenderFilter; label: string; icon: string }[] = [
    { value: 'all', label: 'Toate', icon: '👥' },
    { value: 'boy', label: 'Băieți', icon: '👦' },
    { value: 'girl', label: 'Fete', icon: '👧' }
  ];

  onFilterChange(filter: GenderFilter) {
    this.selectedFilter = filter;
    this.filterChange.emit(filter);
  }
}
