import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ClientsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CustomerConnect-App';
}
