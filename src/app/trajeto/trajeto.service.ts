import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrajetoService {

  constructor(private http:HttpClient) { }

  buscaTrajetosByVeiculo(veiculo : any){
    return this.http.get(`${environment.base_url}/track/trajeto/${veiculo}`)
  }

  buscaTrajetos(veiculo: any, dataIni: any, dataFim: any){
    const params = new HttpParams().set('veiculo', veiculo)
                                   .set('dataIni', dataIni)
                                   .set('dataFim', dataFim)
    return this.http.get(`${environment.base_url}/track/trajeto/trajeto-diario`, {params})
  }

  buscaTrajetoById(id:any){
    return this.http.get(`${environment.base_url}/track/trajeto/${id}`)
  }
}
