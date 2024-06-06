import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ViaCepAddress } from 'src/interfaces/ViaCepAddress';

@Injectable({
  providedIn: 'root'
})
export class ViacepService {

  baseURL = `https://viacep.com.br/ws/`;
  constructor(private http: HttpClient) { }

  public getAddress(cep: string): Observable<ViaCepAddress>
  {
    return this.http.get<ViaCepAddress>(`${this.baseURL}/${cep}/json`);
  }
}
