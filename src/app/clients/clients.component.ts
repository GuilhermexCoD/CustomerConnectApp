import { Component, Injectable } from '@angular/core';
import { Client } from '../../interfaces/Client';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})

@Injectable({providedIn: 'root'})
export class ClientsComponent {
  
  constructor(private http: HttpClient) {
    this.getClients();
  }

  clients : Client[] = []

  public getClients(): void
  {
    this.http.get(`https://localhost:7233/api/Client`).subscribe(
      response => this.clients = response as Client[],
      error => console.log(error)
    )
  }
}
