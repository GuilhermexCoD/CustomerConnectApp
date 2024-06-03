import { Component } from '@angular/core';
import { Client } from 'src/interfaces/Client';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  clients : Client[] = [];
  clientsFiltered : Client[] = [];
  private _searchFilter: string = '';

  public get searchFilter ()
  {
    return this._searchFilter;
  }

  public set searchFilter(value: string)
  {
    this._searchFilter = value;
    this.clientsFiltered = this.searchFilter ? this.searchClients(this.searchFilter) : this.clients;
  }

  constructor(private clientService: ClientService) { }

  ngOnInit(): void
  {
    this.getClients();
  }

  searchClients(searchFilter: string): Client[] 
  {
    searchFilter = searchFilter.toLocaleLowerCase();
    return this.clients.filter(
      client => client.name.toLocaleLowerCase().indexOf(searchFilter) !== -1
    )
  }

  public hasClients() : boolean
  {
    return this.clients && this.clients.length > 0;
  }

  public getClients(): void
  {
    const observer = {
      next: (_clients: Client[]) => {
        this.clients = _clients;
        this.clientsFiltered = this.clients;
      },
      error: (error: any) => console.log(error),
    };

    this.clientService.getClients().subscribe(observer);
  }
}
