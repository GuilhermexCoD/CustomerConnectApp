import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '@app/services/client.service';
import { Client } from 'src/interfaces/Client';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {

  modalRef?: BsModalRef;
  clients : Client[] = [];
  clientsFiltered : Client[] = [];
  deleteClient = {} as Client;
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

  constructor(private clientService: ClientService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router
  ) { }

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
    this.spinner.show();
    const observer = {
      next: (_clients: Client[]) => {
        this.clients = _clients;
        this.clientsFiltered = this.clients;
      },
      error: (error: any) => 
        {
          this.spinner.hide();
          this.toastr.error('Error while loading Clients', 'Error!');

          console.log(error)
        },
      complete: () => this.spinner.hide()
    };

    this.clientService.getClients().subscribe(observer);
  }

  public openModal(event: UIEvent, deleteModal: TemplateRef<void>, eventClient: Client): void
  {
    this.deleteClient = {...eventClient}
    event.stopPropagation();
    this.modalRef = this.modalService.show(deleteModal, { class: 'modal-sm' });
  }
 
  public confirm(): void 
  {
    this.spinner.show();
    const observer = {
      next: (message: Object) => {
        console.log(message);
        this.toastr.success('Client successfully deleted!', 'Deleted');
        this.getClients();
      },
      error: (error: any) => 
        {
          this.toastr.error(`Error while deleting client ${this.deleteClient.name}`, 'Error!');
          console.log(error)
        },
      complete: () => this.spinner.hide()
    };
    this.clientService.deleteClient(this.deleteClient.id).subscribe(observer);
    this.modalRef?.hide();
  }
 
  public decline(): void 
  {
    this.modalRef?.hide();
  }

  detail(id: string): void {
    this.router.navigate([`clients/detail/${id}`]);
  }
}
