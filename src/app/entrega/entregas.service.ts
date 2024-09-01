import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregasService {

  constructor(private http : HttpClient) { }

  pesquisaEntregas(
    descricao : string,
    dataIni : any,
    dataFim : any,
    status : any
  ){
    const params = new HttpParams().set('descricao', descricao).set('dataIni', dataIni+ " 00:00:00")
                                   .set('dataFim', dataFim+ " 24:00:00").set('status', status)
    return this.http.get(`${environment.base_url}/track/entrega/pesquisa`, {params})
  }

  findEntregaById(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.get(`${environment.base_url}/track/entrega`, {params})
  }

  findEntregasByData(data : any){
    const params = new HttpParams().set('data', data)
    return this.http.get(`${environment.base_url}/track/entrega-data`, {params})
  }

  postEntrega(entrega : any){
    return this.http.post(`${environment.base_url}/track/entrega`, entrega)
  }

  deleteEntrega(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/entrega`, {params})
  }

  nextId(){
    return this.http.get(`${environment.base_url}/track/entrega-next-id`)
  }
}
