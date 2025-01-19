import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/components/services/storage/storage.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments/process';  // L'URL de votre backend

  constructor(private http: HttpClient) {}

  processPayment(bookingId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?bookingId=${bookingId}`, {}); // Assurez-vous de spécifier un body si nécessaire
}


  private createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders()

    return authHeaders.set(
      'Authorization',
      `Bearer ${StorageService.getToken()}`
    )
  }
}
