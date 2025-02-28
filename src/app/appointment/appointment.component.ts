import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointments.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RazorpayService } from '../services/razorpay.service';
import { PaymentComponent } from '../payment/payment.component';
declare var Razorpay: any; 
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  imports: [CommonModule, NgFor, ReactiveFormsModule,PaymentComponent]
})
export class AppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  states: string[] = [];
  cities: string[] = [];
  outlets: string[] = [];
  services: any[] = [];
  stylists: string[] = [];
  selectedServices: any[] = [];
  selectedStylists: string[] = [];
  totalCost: number = 0;
  appointmentData: any = {};  
  paymentStatus?: "success";

  constructor(private appointmentService: AppointmentService, private fb: FormBuilder, private razorpayService: RazorpayService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      state: ['', Validators.required],
      city: ['', Validators.required],
      outlet: ['', Validators.required],
      gender: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      message: ['']
    });
  }

  loadStates() {
    this.appointmentService.getStates().subscribe((data: string[]) => {
      this.states = data || [];
    });
  }

  onStateChange(event: any) {
    const state = event.target.value;
    if (!state) return;
    this.appointmentForm.patchValue({ state, city: '', outlet: '' });
    this.cities = [];
    this.outlets = [];
    this.stylists = [];
    this.appointmentService.getCities(state).subscribe((data: string[]) => {
      this.cities = data || [];
    });
  }

  onCityChange(event: any) {
    const city = event.target.value;
    if (!city) return;
    this.appointmentForm.patchValue({ city, outlet: '' });
    this.outlets = [];
    this.stylists = [];
    this.appointmentService.getOutlets(city).subscribe((data: string[]) => {
      this.outlets = data || [];
    });
  }

  onOutletChange(event: any) {
    const outlet = event.target.value;
    if (!outlet) return;
    this.appointmentForm.patchValue({ outlet });
    this.loadServicesAndStylists();
  }

  onGenderChange(event: any) {
    const gender = event.target.value;
    if (!gender) return;
    this.appointmentForm.patchValue({ gender });
    this.loadServicesAndStylists();
  }

  loadServicesAndStylists() {
    const outlet = this.appointmentForm.get('outlet')?.value;
    const gender = this.appointmentForm.get('gender')?.value;

    if (outlet && gender) {
      this.appointmentService.getServices(outlet, gender).subscribe(
        (response: any) => {
          this.services = Array.isArray(response) ? response : [];
        },
        () => {
          this.services = [];
        }
      );
      this.appointmentService.getStylists(outlet, gender).subscribe(
        (response: any) => {
          this.stylists = response && typeof response === 'object'
            ? (gender === 'Male' ? response.maleStylists : response.femaleStylists)
            : [];
        },
        () => {
          this.stylists = [];
        }
      );
    }
  }

  toggleServiceSelection(service: any) {
    const index = this.selectedServices.findIndex(s => s.name === service.name);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    this.calculateTotalCost();
  }

  toggleStylistSelection(stylist: string) {
    const index = this.selectedStylists.indexOf(stylist);
    if (index > -1) {
      this.selectedStylists.splice(index, 1);
    } else {
      this.selectedStylists.push(stylist);
    }
  }

  calculateTotalCost() {
    this.totalCost = this.selectedServices.reduce((sum, service) => sum + service.cost, 0);
  }

  submitAppointment() {
    
    this.appointmentData = {
      state: this.appointmentForm.value.state,
      city: this.appointmentForm.value.city,
      outlet: this.appointmentForm.value.outlet,
      gender: this.appointmentForm.value.gender,
      services: this.selectedServices,
      stylists: this.selectedStylists,
      date: this.appointmentForm.value.date,
      time: this.appointmentForm.value.time,
      name: this.appointmentForm.value.name,
      email: this.appointmentForm.value.email,
      phone: this.appointmentForm.value.phone,
      message: this.appointmentForm.value.message,
      totalCost: this.totalCost,
    };

    this.initiatePayment( this.appointmentData );
  }

  initiatePayment(appointmentData: any) {
    this.razorpayService.createOrder(appointmentData.totalCost).subscribe((response: any) => {
      console.log("Razorpay Order Response:", response); 
  
      if (!response || !response.id) {
        console.error('Invalid order response:', response);
        alert('Failed to create order. Please try again.');
        return;
      }
  
      const options = {
        key: this.razorpayService.getRazorpayKey(),
        amount: response.amount,
        currency: 'INR',
        name: 'Vintage Elegance',
        description: 'Salon Appointment Payment',
        order_id: response.id, 
        handler: (paymentResponse: any) => {
          console.log('Payment Success:', paymentResponse);
  
          alert('Payment successful!');

          this.appointmentData = {
            ...this.appointmentData,
            paymentStatus: 'Successful',
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature
          };
  
          this.postAppointment(appointmentData); 
        },
        prefill: {
          name: appointmentData.name,
          email: appointmentData.email,
          contact: appointmentData.phone
        },
        theme: {
          color: '#F37254'
        }
      };
  
      const razorpay = new Razorpay(options);
  
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        alert('Payment failed. Please try again.');
      });
  
      razorpay.open();
    }, (error) => {
      console.error('Order creation error:', error);
      alert('Error creating order. Please check the console.');
    });
  }
  
   postAppointment(appointmentData: any) {
    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      alert('Appointment data is missing!');
      console.error('Error: Appointment data is empty');
      return;
    }
  
    this.appointmentService.bookAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Appointment booked successfully:', response);
        alert('Appointment confirmed!');
      },
      error: (error) => {
        console.error('Error booking appointment:', error);
        alert('Error booking appointment. Please check the console.');
      },
      complete: () => {
        console.log('Appointment request completed.');
      }
    });
  }
  
}
