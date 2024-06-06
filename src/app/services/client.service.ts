import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Client } from 'src/interfaces/Client';

@Injectable(
  //{ providedIn: 'root'}
)
export class ClientService {
  baseURL = `https://localhost:7233/api/Client`;
  constructor(private http: HttpClient) { }

  public getClients(): Observable<Client[]>
  {
    return this.http
          .get<Client[]>(this.baseURL)
          .pipe(take(1));
  }

  public getClientById(id: string): Observable<Client>
  {
    return this.http
          .get<Client>(`${this.baseURL}/${id}`)
          .pipe(take(1));
  }

  public postClient(client: Client): Observable<Client>
  {
    return this.http
          .post<Client>(this.baseURL, client)
          .pipe(take(1));
  }

  public putClient(client: Client): Observable<Client>
  {
    return this.http
          .put<Client>(`${this.baseURL}/${client.id}`, client)
          .pipe(take(1));
  }
  
  public deleteClient(id: string): Observable<Object>
  {
    return this.http
          .delete(`${this.baseURL}/${id}`)
          .pipe(take(1));
  }
}
