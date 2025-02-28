import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { SalonService } from '../../services/salon.service';
import { Router } from '@angular/router';
import { CommonModule,NgFor } from '@angular/common';

@Component({
  selector: 'app-salon-management',
  templateUrl: './salon-management.component.html',
  styleUrls: ['./salon-management.component.scss'],
  imports : [CommonModule,NgFor],
  encapsulation: ViewEncapsulation.None
})
export class SalonManagementComponent implements OnInit {
  salons: any[] = [];
  page: number = 0;
  size: number = 4;
  sortBy: string = 'outletName';
  totalPages: number = 0;

  // Dialog visibility flags
  showServiceDialog: boolean = false;
  showStylistDialog: boolean = false;

  // Selected data for dialogs
  selectedServices: { name: string; cost: number | string; gender: string }[] = [];
  selectedMaleStylists: string[] = [];
  selectedFemaleStylists: string[] = [];



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

  // viewServices(services: string[]): void {
  //   this.selectedServices = services;
  //   this.showServiceDialog = true;
  // }

  viewServices(services: any[]): void {
    if (!services || services.length === 0) {
      this.selectedServices = [];
    } else if (typeof services[0] === 'string') {
      // Handle case where services are stored as strings instead of objects
      this.selectedServices = services.map(service => ({
        name: service,
        cost: 'N/A',
        gender: 'N/A'
      }));
    } else {
      this.selectedServices = services as { name: string; cost: number; gender: string }[];
    }
    this.showServiceDialog = true;
  }
  
  

  // View Stylists Method
  viewStylists(maleStylists: string[], femaleStylists: string[]): void {
    this.selectedMaleStylists = maleStylists;
    this.selectedFemaleStylists = femaleStylists;
    this.showStylistDialog = true;
  }

  // Close Dialog
  closeDialog(): void {
    this.showServiceDialog = false;
    this.showStylistDialog = false;
  }
}