import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  constructor(private http : HttpClient) { }

  pesquisaVeiculo(
    identificacao : string,
    descricao : string
  ){
    const params = new HttpParams().set('identificacao', identificacao).set('descricao', descricao)
    return this.http.get(`${environment.base_url}/track/veiculo/pesquisa`, {params})
  }

  findVeiculoByIdentificacao(identificacao : any){
    const params = new HttpParams().set('identificacao', identificacao)
    return this.http.get(`${environment.base_url}/track/veiculo`, {params})
  }

  post(veiculo : any){
    return this.http.post(`${environment.base_url}/track/veiculo`, veiculo)
  }

  delete(identificacao : any){
    const params = new HttpParams().set('identificacao', identificacao)
    return this.http.delete(`${environment.base_url}/track/veiculo`, {params})
  }
}
