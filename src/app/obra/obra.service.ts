import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  constructor(private http : HttpClient) { }

  findObraById(id : any){
    return this.http.get(`${environment.base_url}/track/obras/${id}`)
  }

  pesquisaObra(descricao : string, cidade : string){
    const params = new HttpParams().set('descricao', descricao).set('cidade', cidade)
    return this.http.get(`${environment.base_url}/track/obras/pesquisa`, {params})
  }

  buscaObras(){
    return this.http.get(`${environment.base_url}/track/obras`)
  }

  postObra(obra : any){
    return this.http.post(`${environment.base_url}/track/obras`, obra)
  }

  deleteObra(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/obras`, {params})
  }
}
