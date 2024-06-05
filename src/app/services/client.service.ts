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

  public postClient(client: Client): Observable<Client>
  {
    return this.http.post<Client>(this.baseURL, client);
  }

  public putClient(client: Client): Observable<Client>
  {
    return this.http.put<Client>(`${this.baseURL}/${client.id}`, client);
  }
  
  public deleteClient(id: string): Observable<Object>
  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
