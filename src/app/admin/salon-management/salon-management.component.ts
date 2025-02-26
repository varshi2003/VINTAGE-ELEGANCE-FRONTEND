import { Component, OnInit } from '@angular/core';
import { SalonService } from '../../services/salon.service';
import { Router } from '@angular/router';
import { CommonModule,NgFor } from '@angular/common';

@Component({
  selector: 'app-salon-management',
  templateUrl: './salon-management.component.html',
  styleUrls: ['./salon-management.component.css'],
  imports : [CommonModule,NgFor]
})
export class SalonManagementComponent implements OnInit {
  salons: any[] = [];
  page: number = 0;
  size: number = 10;
  sortBy: string = 'outletName';
  totalPages: number = 0;

  constructor(private salonService: SalonService, private router: Router) {}

  ngOnInit(): void {
    this.loadSalons();
  }

  loadSalons(): void {
    this.salonService.getSalons(this.page, this.size, this.sortBy).subscribe(response => {
      this.salons = response.content;
      this.totalPages = response.totalPages;
    });
  }

  createSalon(): void {
    this.router.navigate(['/admin/create-salon']);
  }

  editSalon(id: string): void {
    this.router.navigate([`/salon-management/edit/${id}`]);
  }

  deleteSalon(id: string): void {
    if (confirm('Are you sure you want to delete this salon?')) {
      this.salonService.deleteSalon(id).subscribe(() => {
        this.loadSalons();
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadSalons();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadSalons();
    }
  }
}