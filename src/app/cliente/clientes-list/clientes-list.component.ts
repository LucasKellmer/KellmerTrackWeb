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
import { LoadingComponent } from '../../shared/loading/loading.component'
import { Router } from '@angular/router';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-clientes-list',
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
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss'
})
export class ClientesListComponent implements OnInit{
  nome : any = ''
  rows : any[] = []
  btnExcluir : boolean = false
  deleteCliente : any
  loading : boolean = false
  
  ColumnMode = ColumnMode;

  constructor(private router : Router, private clienteService : ClientesService){}

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.clienteService.pesquisaCliente (
      this.nome
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  cadastrarCliente(){
    this.router.navigate(['clientes/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteCliente = row
  }

  excluirCliente(){
    this.btnExcluir = false
    this.clienteService.deleteCliente(this.deleteCliente.codigo).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['clientes/editar/'+row.id])
  }
  
  visualizar(row : any){
    this.router.navigate(['clientes/'+row.id])
  }

  EnterSubmit(event: any){
    if (event.keyCode === 13){
      this.pesquisar()
    }
  }
}
