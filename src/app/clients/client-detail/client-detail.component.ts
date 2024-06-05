import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '@app/services/client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/interfaces/Client';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent {

  form!: FormGroup;
  client = {} as Client;
  clientIdParam?: string | null;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadClient();
    this.validation();
  }

  public loadClient(): void
  {
    this.clientIdParam = this.router.snapshot.paramMap.get('id');
    if(this.hasClientId())
    {
      this.spinner.show();
      const observer = {
        next: (_client: Client) => {
          this.client = {..._client};
          this.form.patchValue(this.client);
        },
        error: (error: any) => 
          {
            this.spinner.hide();
            this.toastr.error('Error while loading Client', 'Error!');
  
            console.log(error)
          },
        complete: () => this.spinner.hide()
      };
      this.clientService.getClientById(this.clientIdParam!).subscribe(observer);
    }
  }

  public saveChange(): void
  {
    if(this.form.valid)
    {
      if(this.hasClientId())
        this.updateClient();
      else
        this.createClient();
    }
  }

  public updateClient(): void
  {
    this.client = {id: this.client.id, ...this.form.value, phones: []};

    this.spinner.show();
    const observer = {
      next: (message: Client) => {
        console.log(message);
        this.toastr.success('Client successfully updated!', 'Created');
      },
      error: (error: any) => 
        {
          this.toastr.error(`Error while updating client ${this.client.name}`, 'Error!');
          console.log(error)
        },
      complete: () => this.spinner.hide()
    };

    this.clientService.putClient(this.client).subscribe(observer);
  }

  public createClient(): void
  {
    this.client = {...this.form.value, phones: []};

    this.spinner.show();
    const observer = {
      next: (message: Client) => {
        console.log(message);
        this.toastr.success('Client successfully created!', 'Created');
      },
      error: (error: any) => 
        {
          this.toastr.error(`Error while createing client ${this.client.name}`, 'Error!');
          console.log(error)
        },
      complete: () => this.spinner.hide()
    };

    this.clientService.postClient(this.client).subscribe(observer);
  }

  public hasClientId(): boolean
  {
    return this.clientIdParam !== null;
  }

  public validation(): void 
  {
    this.form = this.fb.group({
        name: [
          '', 
          [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
        ],
        age: [
          '18', 
          [Validators.required, Validators.min(18), Validators.max(150)]
        ],
        cpf: [
          '', 
          [Validators.required, Validators.maxLength(11)]
        ],
        rg: [
          '',
          [Validators.required , Validators.maxLength(9)]
        ],
        street: [
          '',
          [Validators.required , Validators.maxLength(150)]
        ],
        city: [
          '',
          [Validators.required , Validators.maxLength(60)]
        ],
        state: [
          '',
          [Validators.required , Validators.maxLength(60)]
        ],
        country: [
          '',
          [Validators.required , Validators.maxLength(60)]
        ],
        postalCode: [
          '',
          [Validators.required , Validators.maxLength(20)]
        ],
      }
    );
  }

  public cssValidation(formControl : FormControl): any
  {
    return {'is-invalid' : formControl?.errors && formControl?.touched};
  }

  public resetForm(): void
  {
    this.form.reset();
  }
}
