import { Component, OnInit } from '@angular/core';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PesquisaService } from '../../pesquisa.service';
import { Router } from '@angular/router';
import { DispositivoService } from '../dispositivo.service';
import { BtnExcluirComponent } from '../../shared/btn-excluir/btn-excluir.component';
import { BtnGridExcluirComponent } from '../../shared/grid/btn-grid-excluir/btn-grid-excluir.component';
import { BtnGridEditarComponent } from '../../shared/grid/btn-grid-editar/btn-grid-editar.component';
import { BtnGridVisualizarComponent } from '../../shared/grid/btn-grid-visualizar/btn-grid-visualizar.component';
import { BtnCadastrarComponent } from '../../shared/btn-cadastrar/btn-cadastrar.component';
import { ToastService } from '../../shared/toast/toast.service';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-dispositivos-list',
  standalone: true,
  imports: [
    NgxDatatableModule,
    HeaderComponent,
    NgIf, NgFor, FormsModule,
    BtnExcluirComponent,
    BtnGridExcluirComponent,
    BtnGridEditarComponent,
    BtnGridVisualizarComponent,
    BtnCadastrarComponent,
    LoadingComponent
  ],
  templateUrl: './dispositivos-list.component.html',
  styleUrl: './dispositivos-list.component.scss'
})
export class DispositivosListComponent implements OnInit {
  title = 'table-tutorial';
  motoristas : any[] = []
  motoritasLoading : boolean = false
  veiculos : any[] = []
  veiculosLoading : boolean = false
  numeroInterno : any = ''
  mac : any = ''
  motoristaSelecionado : any = '999'
  veiculoSelecionado : any = 'todos'
  rows : any[] = []
  btnExcluir : boolean = false
  deleteDispositivo : any

  loading : boolean = false

  constructor(private service : PesquisaService, private router : Router, 
    private dispositivoService : DispositivoService, private toastService: ToastService){}

  ngOnInit(): void {
    this.buscaMotorista()
    this.buscaVeiculos()
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    console.log(this.numeroInterno)
    console.log(this.motoristaSelecionado)
    console.log(this.veiculoSelecionado)
    console.log(this.mac)
    this.dispositivoService.pesquisaDispositivos(
      this.numeroInterno,
      this.motoristaSelecionado,
      this.veiculoSelecionado,
      this.mac
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  buscaMotorista(){
    this.motoritasLoading = true
    this.service.consultar('motoristas').subscribe((dados : any)=>{
      this.motoristas = dados
      this.motoritasLoading = false
    })
  }

  buscaVeiculos(){
    this.veiculosLoading = true
    this.service.consultar('veiculos').subscribe((dados : any)=>{
      this.veiculos = dados
      this.veiculosLoading = false
    })
  }

  cadastrarDispositivo(){
    this.router.navigate(['dispositivos/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteDispositivo = row
  }

  excluirDispositivo(){
    this.btnExcluir = false
    this.dispositivoService.deleteDispositivo(this.deleteDispositivo.id).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['dispositivos/editar/'+row.numeroInterno])
  }
  
  visualizar(row : any){
    this.router.navigate(['dispositivos/'+row.numeroInterno])
  }
}
