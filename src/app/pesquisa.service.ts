import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  constructor(private http : HttpClient) { 
  }
  
  consultar(tabela: string){
    return this.http.get(`${environment.base_url}/pesquisa/${tabela}`)
  }
}
