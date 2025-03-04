import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointments.service';
import { Appointment } from '../../../models/appointments.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss'],
  imports: [CommonModule],
})
export class UserAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedOutlet: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.selectedOutlet = localStorage.getItem('selectedOutlet') || '';
    if (this.selectedOutlet) {
      this.fetchAppointments();
    }
  }

  fetchAppointments(): void {
    this.appointmentService
      .getAppointmentsByOutlet(this.selectedOutlet)
      .subscribe({
        next: (data) => {
          this.appointments = data;
        },
      });
  }

  getServiceNames(appointment: Appointment): string {
    return (
      appointment?.services?.map((service) => service?.name).join(', ') ||
      'No Services'
    );
  }
  getStylistNames(appointment: Appointment): string {
    if (
      !appointment ||
      !appointment.stylists ||
      !Array.isArray(appointment.stylists)
    ) {
      return 'No Stylists';
    }
    return appointment.stylists.join(', ') || 'No Stylists';
  }
}
