import { Component, OnInit } from '@angular/core';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { VeiculoService } from '../veiculo.service';
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
  selector: 'app-veiculos-list',
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
  templateUrl: './veiculos-list.component.html',
  styleUrl: './veiculos-list.component.scss'
})
export class VeiculosListComponent implements OnInit  {
  title = 'table-tutorial';

  rows : any[] = []
  btnExcluir : boolean = false
  deleteVeiculo : any
  identificacao : any = ''
  descricao : any = ''

  ColumnMode = ColumnMode;
  loading : boolean = false

  constructor(private router : Router, private veiculoService : VeiculoService){}

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.veiculoService.pesquisaVeiculo(
      this.identificacao,
      this.descricao
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  cadastrarVeiculo(){
    this.router.navigate(['veiculos/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteVeiculo = row
  }

  excluirVeiculo(){
    this.btnExcluir = false
    this.veiculoService.delete(this.deleteVeiculo.identificacao).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['veiculos/editar/'+row.identificacao])
  }
  
  visualizar(row : any){
    this.router.navigate(['veiculos/'+row.identificacao])
  }
}
