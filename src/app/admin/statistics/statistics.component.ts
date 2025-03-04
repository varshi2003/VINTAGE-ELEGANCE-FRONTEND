
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SalonService } from '../../services/salon.service';
import { AppointmentService } from '../../services/appointments.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  totalSalons: number = 0;
  maleStylistsCount: number = 0;
  femaleStylistsCount: number = 0;
  totalRevenue: number = 0;
  maxRevenueOutlet: string = '';
  totalServicesDone: number = 0;
  revenueByOutlet: { outlet: string; revenue: number }[] = [];
  servicesByOutlet: { outlet: string; serviceCount: number }[] = [];

  constructor(private salonService: SalonService, private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.fetchTotalSalons();
    this.fetchStylistsCount();
    this.fetchRevenueDetails();
    this.fetchServiceCounts();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderStylistsChart();
      this.renderRevenueChart();
      this.renderServicesChart();
    }, 1000);
  }

  fetchTotalSalons() {
    this.salonService.getSalons(0, 100, 'outletName').subscribe((data) => {
      this.totalSalons = data.totalElements;
    });
  }

  fetchStylistsCount() {
    this.salonService.getSalons(0, 100, 'outletName').subscribe((data) => {
      this.maleStylistsCount = data.content.reduce((acc: number, salon: any) => acc + salon.maleStylists.length, 0);
      this.femaleStylistsCount = data.content.reduce((acc: number, salon: any) => acc + salon.femaleStylists.length, 0);
      this.renderStylistsChart();
    });
  }

  fetchRevenueDetails() {
    this.appointmentService.getAllAppointments().subscribe((appointments) => {
      let revenueMap = new Map<string, number>();

      appointments.forEach((appointment) => {
        this.totalRevenue += appointment.totalCost;
        if (revenueMap.has(appointment.outlet)) {
          revenueMap.set(appointment.outlet, revenueMap.get(appointment.outlet)! + appointment.totalCost);
        } else {
          revenueMap.set(appointment.outlet, appointment.totalCost);
        }
      });

      this.revenueByOutlet = Array.from(revenueMap, ([outlet, revenue]) => ({ outlet, revenue }));
      this.maxRevenueOutlet = this.revenueByOutlet.reduce((max, outlet) => (outlet.revenue > max.revenue ? outlet : max), { outlet: '', revenue: 0 }).outlet;
      
      this.renderRevenueChart();
    });
  }

  fetchServiceCounts() {
    this.appointmentService.getAllAppointments().subscribe((appointments) => {
      this.totalServicesDone = appointments.length;

      let serviceMap = new Map<string, number>();
      appointments.forEach((appointment) => {
        if (serviceMap.has(appointment.outlet)) {
          serviceMap.set(appointment.outlet, serviceMap.get(appointment.outlet)! + 1);
        } else {
          serviceMap.set(appointment.outlet, 1);
        }
      });

      this.servicesByOutlet = Array.from(serviceMap, ([outlet, serviceCount]) => ({ outlet, serviceCount }));
      this.renderServicesChart();
    });
  }


  renderStylistsChart() {
    new Chart('stylistsChart', {
      type: 'pie',
      data: {
        labels: ['Male Stylists', 'Female Stylists'],
        datasets: [{
          data: [this.maleStylistsCount, this.femaleStylistsCount],
          backgroundColor: ['#007bff', '#ff6384'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Gender Distribution of Stylists',
            font: {
              size: 18
            },
            padding: {
              top: 20,
              bottom: 10
            }
          }
        }
      }
    });
  }
  
  renderRevenueChart() {
    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: this.revenueByOutlet.map(o => o.outlet),
        datasets: [{
          label: 'Revenue',
          data: this.revenueByOutlet.map(o => o.revenue),
          backgroundColor: this.revenueByOutlet.map(o => o.outlet === this.maxRevenueOutlet ? '#ffcc00' : '#36a2eb'),
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Revenue by Outlet',
            font: {
              size: 18
            },
            padding: {
              top: 20,
              bottom: 10
            }
          }
        }
      }
    });
  }
  
  renderServicesChart() {
    new Chart('servicesChart', {
      type: 'bar',
      data: {
        labels: this.servicesByOutlet.map(o => o.outlet),
        datasets: [{
          label: 'Appointments Count',
          data: this.servicesByOutlet.map(o => o.serviceCount),
          backgroundColor: '#4caf50',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Number of Appointments by Outlet',
            font: {
              size: 18
            },
            padding: {
              top: 20,
              bottom: 10
            }
          }
        }
      }
    });
  }
}  