import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Phone } from 'src/interfaces/Phone';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  baseURL = `https://localhost:7233/api/phone`;
  constructor(private http: HttpClient) { }

  public getPhones(): Observable<Phone[]>
  {
    return this.http
            .get<Phone[]>(this.baseURL)
            .pipe(take(1));
  }

  public getPhoneById(id: string): Observable<Phone>
  {
    return this.http
            .get<Phone>(`${this.baseURL}/${id}`)
            .pipe(take(1));
  }

  public postPhone(phone: Phone): Observable<Phone>
  {
    return this.http
            .post<Phone>(this.baseURL, phone)
            .pipe(take(1));
  }

  public putPhone(phone: Phone): Observable<Phone>
  {
    return this.http
            .put<Phone>(`${this.baseURL}/${phone.id}`, phone)
            .pipe(take(1));
  }

  public postPhones(phone: Phone[]): Observable<Phone[]>
  {
    return this.http
            .post<Phone[]>(`${this.baseURL}/range`, phone)
            .pipe(take(1));
  }

  public putPhones(clientId: string, phones: Phone[]): Observable<Phone[]>
  {
    phones.forEach((phone: Phone) => {
      phone.clientId = clientId;
    });

    console.log(phones);

    return this.http
            .put<Phone[]>(`${this.baseURL}/range`, phones)
            .pipe(take(1));
  }
  
  public deletePhone(id: string): Observable<Object>
  {
    return this.http
            .delete(`${this.baseURL}/${id}`)
            .pipe(take(1));
  }
}
