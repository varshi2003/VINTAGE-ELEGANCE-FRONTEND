import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointments.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
 
  private baseUrl = 'http://localhost:8080/salons';
  private apiUrl = 'http://localhost:8080/appointments'; 

  constructor(private http: HttpClient) {}

  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/states`);
  }

  getCities(state: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/cities/${state}`);
  }

  getOutlets(city: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/outlets/${city}`);
  }

  getServices(outlet: string, gender: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/services/${outlet}/${gender}`);
  }

  getStylists(outlet: string, gender: string) {
    return this.http.get<string[]>(`${this.baseUrl}/stylists/${outlet}`);
  }
  bookAppointment(appointmentData: any): Observable<any> {
    console.log('Sending appointment data to backend:', appointmentData);  
    return this.http.post(`${this.apiUrl}/book`, appointmentData);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all`);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  createPaymentOrder(amount: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/payments/create-order?amount=${amount}`, {});
  }

  updatePaymentStatus(paymentId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${paymentId}/update-status`, { status });
  }
  
}
