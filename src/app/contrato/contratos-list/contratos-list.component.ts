import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BtnCadastrarComponent } from '../../shared/btn-cadastrar/btn-cadastrar.component';
import { BtnExcluirComponent } from '../../shared/btn-excluir/btn-excluir.component';
import { BtnGridEditarComponent } from '../../shared/grid/btn-grid-editar/btn-grid-editar.component';
import { BtnGridExcluirComponent } from '../../shared/grid/btn-grid-excluir/btn-grid-excluir.component';
import { BtnGridVisualizarComponent } from '../../shared/grid/btn-grid-visualizar/btn-grid-visualizar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { PesquisaService } from '../../pesquisa.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ContratosService } from '../contratos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contratos-list',
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
  templateUrl: './contratos-list.component.html',
  styleUrl: './contratos-list.component.scss'
})
export class ContratosListComponent implements OnInit {
  title = 'table-tutorial';
  empresas : any[] = []
  empresasLoading : boolean = false
  cliente : any = '';
  numero : any = ''
  empresaSelecionada : any = '999'
  rows : any[] = []
  btnExcluir : boolean = false
  deleteContrato : any

  loading : boolean = false
  ColumnMode = ColumnMode

  constructor(private service : PesquisaService, private router : Router, 
    private contratoService : ContratosService, private toastService: ToastService){}

  ngOnInit(): void {
    this.buscaEmpresas()
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    console.log(this.numero)
    console.log(this.empresaSelecionada)
    this.contratoService.pesquisaContrato(
      this.numero,
      this.empresaSelecionada,
      this.cliente,
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  buscaEmpresas(){
    this.empresasLoading = true
    this.service.consultar('empresas').subscribe((dados : any)=>{
      this.empresas = dados
      this.empresasLoading = false
    })
  }

  cadastrarDispositivo(){
    this.router.navigate(['contratos/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteContrato = row
  }

  excluirDispositivo(){
    this.btnExcluir = false
    this.contratoService.deleteContrato(this.deleteContrato.id).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['contratos/editar/'+row.numero])
  }
  
  visualizar(row : any){
    this.router.navigate(['contratos/'+row.numero])
  }
}

