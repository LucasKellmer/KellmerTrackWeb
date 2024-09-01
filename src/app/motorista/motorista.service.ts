import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {

  constructor(private http : HttpClient) { }

  pesquisaMotorista(
    nome:string
  ){
    const params = new HttpParams().set('nome', nome)
    return this.http.get(`${environment.base_url}/track/motorista/pesquisa`, {params})
  }

  findMotoristaById(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.get(`${environment.base_url}/track/motorista`, {params})
  }

  post(motorista : any){
    return this.http.post(`${environment.base_url}/track/motorista`, motorista)
  }

  delete(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/motorista`, {params})
  }
  
  nextId(){
    return this.http.get(`${environment.base_url}/track/motorista-next-id`)
  }
}
