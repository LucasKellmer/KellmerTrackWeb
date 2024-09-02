import { Component, OnInit } from '@angular/core';
import { ObraService } from '../obra.service';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
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
  selector: 'app-obras-list',
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
  templateUrl: './obras-list.component.html',
  styleUrl: './obras-list.component.scss'
})
export class ObrasListComponent implements OnInit{

  cidade : any = ''
  descricao : any = ''
  rows : any[] = []
  btnExcluir : boolean = false
  deleteObra : any
  loading : boolean = false
  
  ColumnMode = ColumnMode;

  constructor(private router : Router, private empresaService : ObraService){}

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.empresaService.pesquisaObra (
      this.descricao,
      this.cidade,
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  cadastrarObra(){
    this.router.navigate(['obras/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteObra = row
  }

  excluirObra(){
    this.btnExcluir = false
    this.empresaService.deleteObra(this.deleteObra.id).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['obras/editar/'+row.id])
  }
  
  visualizar(row : any){
    this.router.navigate(['obras/'+row.id])
  }

  EnterSubmit(event: any){
    if (event.keyCode === 13){
      this.pesquisar()
    }
  }
}