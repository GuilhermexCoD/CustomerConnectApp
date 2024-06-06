import { Component, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '@app/services/client.service';
import { PhoneService } from '@app/services/phone.service';
import { ViacepService } from '@app/services/viacep.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/interfaces/Client';
import { Phone } from 'src/interfaces/Phone';
import { ViaCepAddress } from 'src/interfaces/ViaCepAddress';

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})

export class ClientDetailComponent {

  modalRef?: BsModalRef;
  form!: FormGroup;
  client = {} as Client;
  clientIdParam?: string | null;
  deletePhone = {} as Phone;
  deletePhoneIndex?: number;

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }
  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cepService: ViacepService,
    private phoneService: PhoneService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadClient();
    this.validation();
  }

  public searchPostalCode(event: FocusEvent)
  {
    var inputValue = (event.target as HTMLInputElement).value;
    
    var cep = inputValue.replace(/\D/g, '');
    
    if (cep != "") 
    {
      this.spinner.show();
      var validateCep = /^[0-9]{8}$/;

      if(validateCep.test(cep))
      {
        const observer = {
          next: (viaCepAddress: ViaCepAddress) => {
            console.log(viaCepAddress);
            this.client.street = viaCepAddress.logradouro;
            this.client.city = viaCepAddress.localidade;
            this.client.state = viaCepAddress.uf;
            this.client.country = `Brasil`;
            this.client.postalCode = cep;
            this.form.patchValue(this.client);

            this.toastr.success('Found valid cep!', 'Found');
          },
          error: (error: any) => 
            {
              this.toastr.error(`Error while searching zipcode ${cep}`, 'Error!');
              console.log(error)
            },
        };
        this.cepService.getAddress(cep)
          .subscribe(observer)
          .add(() => this.spinner.hide());
        return;
      }
    }
  }

  public loadClient(): void
  {
    this.clientIdParam = this.activatedRouter.snapshot.paramMap.get('id');
    if(this.hasClientId())
    {
      this.spinner.show();
      const observer = {
        next: (_client: Client) => {
          this.client = {..._client};
          this.form.patchValue(this.client);
          this.client.phones.forEach(phone =>
            {
              this.phones.push(
                this.createPhone(phone)
              )
            }
          );
        },
        error: (error: any) => 
          {
            this.toastr.error('Error while loading Client', 'Error!');
  
            console.log(error)
          },
      };
      this.clientService.getClientById(this.clientIdParam!)
        .subscribe(observer)
        .add(() => this.spinner.hide());
    }
  }

  public saveClient(): void
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
    this.client = {id: this.client.id, ...this.form.value, phones: this.form.value.phones};

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
    };

    this.clientService.putClient(this.client)
      .subscribe(observer)
      .add(()=> this.spinner.hide());
  }

  public createClient(): void
  {
    this.client = {...this.form.value, phones: []};

    this.spinner.show();
    const observer = {
      next: (client: Client) => {
        console.log(client);
        this.toastr.success('Client successfully created!', 'Created');
        this.router.navigate([`clients/detail/${client.id}`]);
      },
      error: (error: any) => 
        {
          this.toastr.error(`Error while createing client ${this.client.name}`, 'Error!');
          console.log(error)
        },
    };

    this.clientService.postClient(this.client)
      .subscribe(observer)
      .add(()=> this.spinner.hide());
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
        phones: this.fb.array([])
      }
    );
  }

  addPhone(): void
  {
    this.phones.push(
      this.createPhone({} as Phone)
    )
  }

  createPhone(phone: Phone): FormGroup
  {
    return this.fb.group({
      id: [
        phone.id ?? EMPTY_GUID,
      ],
      type: [
        phone.type,
        [Validators.required]
      ],
      phoneNumber: [
        phone.phoneNumber,
        [Validators.required]
      ]
    });
  }

  public savePhones(): void
  {
    if(this.form.controls['phones'].valid)
    {
      this.spinner.show();
      
      const observer = {
        next: (phones: Phone[]) => {
          console.log(phones);
          this.toastr.success('Phones successfully updated!', 'Created');
        },
        error: (error: any) => 
          {
            this.toastr.error(`Error while updating Phones ${JSON.stringify(this.form.controls['phones'].value)}`, 'Error!');
            console.log(error)
          },
      };
      this.phoneService.putPhones(this.client.id ,this.form.controls['phones'].value)
        .subscribe(observer)
        .add(() => this.spinner.hide());
    }
  }

  public removePhone(deleteModal: TemplateRef<void>,
                      phoneIndex: number): void
  {
    this.deletePhoneIndex = phoneIndex;
    this.deletePhone = this.phones.get(phoneIndex.toString())!.value as Phone;
    console.log(`remove: ${JSON.stringify(this.deletePhone)}`);
    this.modalRef = this.modalService.show(deleteModal, { class: 'modal-sm' });
  }

  public confirmDeletePhone(): void
  {
    this.modalRef?.hide();
    this.spinner.show();

    if(this.deletePhone.id != EMPTY_GUID)
    {
      const observer = {
        next: (message: Object) => {
          console.log(message);
          this.phones.removeAt(this.deletePhoneIndex!);
          this.toastr.success('Phone successfully deleted!', 'Deleted');
          this.loadClient();
        },
        error: (error: any) => 
          {
            this.toastr.error(`Error while deleting Phone ${this.deletePhone.phoneNumber}`, 'Error!');
            console.log(error)
          },
        complete: () => this.spinner.hide()
      };
      console.log(this.deletePhone);
      this.phoneService.deletePhone(this.deletePhone.id)
        .subscribe(observer)
        .add(()=> this.spinner.hide());
    }
    else
    {
      this.phones.removeAt(this.deletePhoneIndex!);
      this.spinner.hide();
    }
    
  }

  public declineDeletePhone(): void
  {
    this.modalRef?.hide();
  }

  public cssValidation(formControl : AbstractControl): any
  {
    return {'is-invalid' : formControl?.errors && formControl?.touched};
  }

  public resetForm(): void
  {
    this.form.reset();
  }
}
