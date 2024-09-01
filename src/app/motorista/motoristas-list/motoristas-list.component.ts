import { Component, OnInit } from '@angular/core';
import { PesquisaService } from '../../pesquisa.service';
import { Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BtnCadastrarComponent } from '../../shared/btn-cadastrar/btn-cadastrar.component';
import { BtnExcluirComponent } from '../../shared/btn-excluir/btn-excluir.component';
import { BtnGridEditarComponent } from '../../shared/grid/btn-grid-editar/btn-grid-editar.component';
import { BtnGridExcluirComponent } from '../../shared/grid/btn-grid-excluir/btn-grid-excluir.component';
import { BtnGridVisualizarComponent } from '../../shared/grid/btn-grid-visualizar/btn-grid-visualizar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoadingComponent } from '../../shared/loading/loading.component';


@Component({
  selector: 'app-motoristas-list',
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
  templateUrl: './motoristas-list.component.html',
  styleUrl: './motoristas-list.component.scss'
})
export class MotoristasListComponent implements OnInit  {
  title = 'table-tutorial';

  rows : any[] = []
  btnExcluir : boolean = false
  deleteMotorista : any
  nome : any = ''

  ColumnMode = ColumnMode;
  loading : boolean = false

  constructor(private router : Router, 
    private motoristaService : MotoristaService){}

  ngOnInit(): void {
    this.pesquisar() 
  }

  pesquisar(){
    this.loading = true
    this.motoristaService.pesquisaMotorista(
      this.nome
    ).subscribe((dados : any)=>{
      this.rows = dados

      this.loading = false
    })
  }

  cadastrarMotorista(){
    this.router.navigate(['motoristas/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteMotorista = row
  }

  excluirMotorista(){
    this.btnExcluir = false
    this.motoristaService.delete(this.deleteMotorista.id).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['motoristas/editar/'+row.id])
  }
  
  visualizar(row : any){
    this.router.navigate(['motoristas/'+row.id])
  }
}
