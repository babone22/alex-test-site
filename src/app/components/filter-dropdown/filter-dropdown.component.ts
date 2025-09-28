import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-dropdown">
      <label class="filter-label">{{ label }}</label>
      <select 
        [(ngModel)]="selectedValue" 
        (ngModelChange)="onSelectionChange($event)"
        class="filter-select">
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .filter-dropdown {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 150px;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin: 0;
    }

    .filter-select {
      padding: 8px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .filter-select:hover {
      border-color: #007bff;
    }

    .filter-select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    @media (max-width: 768px) {
      .filter-dropdown {
        min-width: 120px;
      }
      
      .filter-label {
        font-size: 13px;
      }
      
      .filter-select {
        font-size: 13px;
        padding: 6px 10px;
      }
    }
  `]
})
export class FilterDropdownComponent {
  @Input() label: string = '';
  @Input() options: FilterOption[] = [];
  @Input() selectedValue: string = '';
  @Output() selectionChange = new EventEmitter<string>();

  onSelectionChange(value: string) {
    this.selectedValue = value;
    this.selectionChange.emit(value);
  }
}
