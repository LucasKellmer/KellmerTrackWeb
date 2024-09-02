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
import { EmpresaService } from '../empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas-list',
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
  templateUrl: './empresas-list.component.html',
  styleUrl: './empresas-list.component.scss'
})
export class EmpresasListComponent implements OnInit{

  codigo : any = ''
  descricao : any = ''
  rows : any[] = []
  btnExcluir : boolean = false
  deleteEmpresa : any
  loading : boolean = false
  
  ColumnMode = ColumnMode;

  constructor(private router : Router, private empresaService : EmpresaService){}

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.empresaService.pesquisaEmpresa (
      this.codigo,
      this.descricao,
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  cadastrarEmpresa(){
    this.router.navigate(['empresas/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteEmpresa = row
  }

  excluirEmpresa(){
    this.btnExcluir = false
    this.empresaService.deleteEmpresa(this.deleteEmpresa.codigo).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['empresas/editar/'+row.codigo])
  }
  
  visualizar(row : any){
    this.router.navigate(['empresas/'+row.codigo])
  }

  EnterSubmit(event: any){
    if (event.keyCode === 13){
      this.pesquisar()
    }
  }
}
