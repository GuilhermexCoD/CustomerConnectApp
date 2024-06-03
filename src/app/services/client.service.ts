import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/interfaces/Client';

@Injectable(
  //{ providedIn: 'root'}
)
export class ClientService {
  baseURL = `https://localhost:7233/api/Client`;
  constructor(private http: HttpClient) { }

  public getClients(): Observable<Client[]>
  {
    return this.http.get<Client[]>(this.baseURL)
  }

  public getClientById(id: string): Observable<Client>
  {
    return this.http.get<Client>(`${this.baseURL}/${id}`)
  }
}
