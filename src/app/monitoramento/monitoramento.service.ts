import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoramentoService{

  constructor(private http:HttpClient) { }

  listVeiculos(){
    return this.http.get(`${environment.base_url}/track/monitoramento/veiculos`)
  }

  buscaUsinas(){
    return this.http.get(`${environment.base_url}/track/monitoramento/usinas`)
  }

  buscaEntregas(){
    return this.http.get(`${environment.base_url}/track/monitoramento/entregas`)
  }

  buscaRotacoesByVeiculo(veiculo : any){
    return this.http.get(`${environment.base_url}/track/monitoramento/veiculo/${veiculo}`)
  }

  /*buscaRotacoesByEntrega(entregaId : any){
    return this.http.get(`${environment.base_url}/track/monitoramento/rotacoes/${entregaId}`)
  }*/
}
