import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private http : HttpClient) { }

  pesquisaDispositivos(
    numeroInterno : string,
    motorista : number,
    veiculo : string,
    mac : string
  ){
    const params = new HttpParams().set('numeroInterno', numeroInterno).set('motoristaId', motorista)
                                   .set('veiculoId', veiculo).set('mac', mac)
    return this.http.get(`${environment.base_url}/track/dispositivos/pesquisa`, {params})
  }

  findDispositivoByNumeroInterno(numeroInterno : any){
    const params = new HttpParams().set('numeroInterno', numeroInterno)
    return this.http.get(`${environment.base_url}/track/dispositivo`, {params})
  }

  postDispositivo(dispositivo : any){
    return this.http.post(`${environment.base_url}/track/dispositivo`, dispositivo)
  }

  deleteDispositivo(id : any){
    const params = new HttpParams().set('id', id)
    return this.http.delete(`${environment.base_url}/track/dispositivo`, {params})
  }

  validaNumeroInterno(numeroInterno : any){
    const params = new HttpParams().set('numeroInterno', numeroInterno)
    return this.http.get(`${environment.base_url}/track/dispositivo-numero`, {params})
  }

  validaMac(mac : any){
    const params = new HttpParams().set('mac', mac)
    return this.http.get(`${environment.base_url}/track/dispositivo-mac`, {params})
  }

  validaVeiculo(veiculo : any){
    const params = new HttpParams().set('veiculo', veiculo)
    return this.http.get(`${environment.base_url}/track/dispositivo-veiculo`, {params})
  }

  validaMotorista(motorista : any){
    const params = new HttpParams().set('motorista', motorista)
    return this.http.get(`${environment.base_url}/track/dispositivo-motorista`, {params})
  }

  nextId(){
    return this.http.get(`${environment.base_url}/track/dispositivo-next-id`)
  }

  apagaVinculo(numeroInterno : string){
    return this.http.put(`${environment.base_url}/track/dispositivo-vinculo/${numeroInterno}`, numeroInterno)
  }

}
