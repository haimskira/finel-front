import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { Profile } from '../models/profile.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public profile: any;
  private apiUrl = 'http://127.0.0.1:8000/getprofile/';
  private purchaseUrl = 'http://127.0.0.1:8000/profile/purchases/';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  }
  getPurchaseHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.purchaseUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch purchases:', error);
          return throwError(error);
        })
      );
  }
  

  updateProfile(profile: Profile): Observable<Profile> {
    const url = `${this.apiUrl}${profile.pk}`;
    console.log("Updating profile:", profile);
    const formData = new FormData();
    Object.keys(profile).forEach((key) => {
    const profileKey = key as keyof Profile;
      if (profile[profileKey] !== null) {
        formData.append(key, profile[profileKey] as any);
      }
    });
      return this.http.put<Profile>(url, formData, { headers: this.getHeaders() });
  }
  

  deleteProfile(pk: number): Observable<void> {
    const url = `${this.apiUrl}${pk}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Failed to delete profile:', error);
          return throwError(error);
        })
      );
  }
  getProfile(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  

  fetchProfile(): Observable<Profile> {
    const headers = this.getHeaders(); // Get the headers
  
    return this.http.get<Profile[]>(this.apiUrl, { headers }).pipe(
      map((profiles: Profile[]) => {
        if (profiles.length > 0) {
          return profiles[0]; // Return the first profile object from the array
        } else {
          throw new Error('Profile data not available');
        }
      }),
      tap((profile: Profile) => {
        this.profile = profile; // Assign the profile data to the class property
      }),
      catchError((error) => {
        console.error('Failed to fetch profile:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }
  uploadPhoto(file: File): Observable<any> {
    const formData: FormData = new FormData();
    const headers = this.getHeaders();
    formData.append('profileimage', file);
  
    return this.fetchProfile().pipe(
      switchMap((profile: Profile) => {
        if (profile) {
          return this.http.post<any>(`${this.apiUrl}${profile.pk}/update_profile_image/`, formData, { headers });
        } else {
          console.error('Profile data not available');
          return throwError('Profile data not available');
        }
      }),
      catchError((error) => {
        console.error('Failed to upload photo:', error);
        return throwError('Failed to upload photo');
      })
    );
  }
  

}
