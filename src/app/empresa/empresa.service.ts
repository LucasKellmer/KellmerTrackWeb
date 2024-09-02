import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService{

  constructor(private http : HttpClient) { }

  findEmpresaByCodigo(codigo : any){
    return this.http.get(`${environment.base_url}/track/empresas/${codigo}`)
  }

  pesquisaEmpresa(codigo : string, descricao : string){
    const params = new HttpParams().set('codigo', codigo).set('descricao', descricao)
    return this.http.get(`${environment.base_url}/track/empresas/pesquisa`, {params})
  }

  buscaEmpresas(empresa : any){
    return this.http.get(`${environment.base_url}/track/empresas`, empresa)
  }

  postEmpresa(empresa : any){
    return this.http.post(`${environment.base_url}/track/empresas`, empresa)
  }

  deleteEmpresa(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/empresas`, {params})
  }
}
