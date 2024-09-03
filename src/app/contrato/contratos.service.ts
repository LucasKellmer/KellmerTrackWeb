import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  constructor(private http : HttpClient) { }

  findContratoByNumero(numero : any){
    return this.http.get(`${environment.base_url}/track/contratos/${numero}`)
  }

  pesquisaContrato(numero : string, empresa : string, cliente : string){
    const params = new HttpParams().set('numero', numero).set('empresa', empresa).set('cliente', cliente)
    return this.http.get(`${environment.base_url}/track/contratos/pesquisa`, {params})
  }

  buscaContratos(){
    return this.http.get(`${environment.base_url}/track/contratos`)
  }

  postContrato(contrato : any){
    return this.http.post(`${environment.base_url}/track/contratos`, contrato)
  }

  deleteContrato(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/contratos`, {params})
  }
}
