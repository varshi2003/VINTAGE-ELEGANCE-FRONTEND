
import { Component, Input, OnInit } from '@angular/core';
import { RazorpayService } from '../services/razorpay.service';
import { AppointmentService } from '../services/appointments.service';

declare let Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  
  @Input() appointmentData: any;  
  
  constructor(
    private razorpayService: RazorpayService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {}

  initiatePayment() {
    if (!this.appointmentData) {
      alert("Appointment details are missing!");
      return;
    }

    const amountInPaise = this.appointmentData.totalCost * 100; 
    this.razorpayService.createOrder(amountInPaise).subscribe((response: any) => {
      if (!response || !response.id) {
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
          alert('Payment successful!');

          this.appointmentData.paymentStatus = 'Successful';
          this.appointmentData.razorpay_order_id = paymentResponse.razorpay_order_id;
          this.appointmentData.razorpay_payment_id = paymentResponse.razorpay_payment_id;
          this.appointmentData.razorpay_signature = paymentResponse.razorpay_signature;
          this.bookAppointment(this.appointmentData);
        },
        prefill: {
          name: this.appointmentData.name,
          email: this.appointmentData.email,
          contact: this.appointmentData.phone
        },
        theme: {
          color: '#F37254'
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        alert('Payment failed. Please try again.');
      });

      razorpay.open();
    }, (error) => {
      alert('Error creating order. Please check the console.');
    });
  }

  private bookAppointment(appointmentData: any) {
    this.appointmentService.bookAppointment(appointmentData).subscribe(
      (res) => {
        alert('Appointment successfully booked!');
      },
      (err) => {
        alert('Error booking appointment. Check console.');
      }
    );
  }
}
