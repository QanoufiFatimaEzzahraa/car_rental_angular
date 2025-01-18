import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, { amount, currency });
  }
}
