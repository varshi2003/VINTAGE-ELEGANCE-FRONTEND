import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointments.service';
import { Appointment } from '../../../models/appointments.model';
import { CommonModule, NgFor } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-moderator-statistics',
  templateUrl: './moderator-statistics.component.html',
  styleUrls: ['./moderator-statistics.component.scss'],
  imports: [CommonModule, NgFor],
})
export class ModeratorStatisticsComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedOutlet: string = '';
  filterType: string = 'day';
  totalRevenue: number = 0;
  totalAppointments: number = 0;
  uniqueCustomers: number = 0;
  stylistStats: { name: string; serviceCount: number; bonus: number }[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.selectedOutlet = localStorage.getItem('selectedOutlet') || '';
    if (this.selectedOutlet) {
      this.fetchAppointments();
    } else {
    }
  }

  fetchAppointments(): void {
    this.appointmentService
      .getAppointmentsByOutlet(this.selectedOutlet)
      .subscribe({
        next: (data) => {
          this.appointments = data;
          this.calculateStatistics();
        },
      });
  }

  calculateStatistics(): void {
    const filteredAppointments = this.filterAppointmentsByTime();

    this.totalRevenue = filteredAppointments.reduce(
      (sum, appt) => sum + appt.totalCost,
      0
    );

    this.totalAppointments = filteredAppointments.length;

    const uniqueCustomerNames = new Set(
      filteredAppointments.map((appt) => appt.name)
    );
    this.uniqueCustomers = uniqueCustomerNames.size;

    const stylistMap = new Map<string, number>();

    filteredAppointments.forEach((appt) => {
      appt.stylists.forEach((stylist) => {
        stylistMap.set(stylist, (stylistMap.get(stylist) || 0) + 1);
      });
    });

    this.stylistStats = Array.from(stylistMap, ([name, serviceCount]) => {
      let bonus = 0;
      if (serviceCount > 5) {
        bonus = Math.floor(serviceCount / 5) * 2;
      }
      return { name, serviceCount, bonus };
    });
  }

  filterAppointmentsByTime(): Appointment[] {
    const now = moment();
    return this.appointments.filter((appt) => {
      const appointmentDate = moment(appt.date, 'YYYY-MM-DD');
      switch (this.filterType) {
        case 'day':
          return appointmentDate.isSame(now, 'day');
        case 'week':
          return appointmentDate.isSame(now, 'week');
        case 'month':
          return appointmentDate.isSame(now, 'month');
        case 'year':
          return appointmentDate.isSame(now, 'year');
        default:
          return true;
      }
    });
  }

  setFilter(filter: string): void {
    this.filterType = filter;
    this.calculateStatistics();
  }
}
