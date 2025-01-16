import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/components/services/storage/storage.service'


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/customer/profile';  // Endpoint du backend pour le profil utilisateur

  constructor(private http: HttpClient) {}

  // Récupérer les informations du profil utilisateur
  getUserProfile(): Observable<any> {
    console.log('Requête GET envoyée au backend');
    return this.http.get<any>(this.apiUrl,
      {
        headers: this.createAuthorizationHeader()
      });
  }

  // Mettre à jour le profil utilisateur
  updateUserProfile(updatedProfile: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, updatedProfile,
      {
        headers: this.createAuthorizationHeader()
      });
      }

      private createAuthorizationHeader(): HttpHeaders {
        let authHeaders: HttpHeaders = new HttpHeaders()

        return authHeaders.set(
          'Authorization',
          `Bearer ${StorageService.getToken()}`
        )
      }

  }








