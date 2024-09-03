import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http : HttpClient) { }

  findClienteById(id : any){
    return this.http.get(`${environment.base_url}/track/clientes/${id}`)
  }

  pesquisaCliente(nome : string){
    const params = new HttpParams().set('nome', nome)
    return this.http.get(`${environment.base_url}/track/clientes/pesquisa`, {params})
  }

  buscaClientes(){
    return this.http.get(`${environment.base_url}/track/clientes`)
  }

  postCliente(cliente : any){
    return this.http.post(`${environment.base_url}/track/clientes`, cliente)
  }

  deleteCliente(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/clientes`, {params})
  }
}