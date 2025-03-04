import { Component, OnInit } from '@angular/core';
import { AdminRequestService } from '../../services/admin-request.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-franchise-management',
  imports: [CommonModule, NgFor],
  templateUrl: './franchise-management.component.html',
  styleUrl: './franchise-management.component.scss',
  standalone: true,
})
export class FranchiseManagementComponent implements OnInit {
  requests: any[] = [];
  

  constructor(private adminRequestService: AdminRequestService) {}

  ngOnInit(): void {
    this.getRequests();
  }
  getRequests() {
    this.adminRequestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data.map((req) => ({
          ...req,
          _id: req._id || req.id || req.requestId, 
        }));
      },
      error: (error) => {
      },
    });
  }

  updateStatus(requestId: string | undefined, status: string, message: string) {
    if (!requestId) {
      alert('Error: Unable to update request due to missing ID.');
      return;
    }

    this.adminRequestService
      .updateRequestStatus(requestId, status, message)
      .subscribe({
        next: (response) => {
          alert('Request updated successfully.');
          this.getRequests();
        },
        error: (error) => {
          alert('Failed to update request. Please try again.');
        },
      });
  }
}

