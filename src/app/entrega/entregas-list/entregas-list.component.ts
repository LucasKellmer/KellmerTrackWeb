import { Component, OnInit } from '@angular/core';
import { PesquisaService } from '../../pesquisa.service';
import { Router } from '@angular/router';
import { EntregasService } from '../entregas.service';
import { NgIf, NgFor, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BtnCadastrarComponent } from '../../shared/btn-cadastrar/btn-cadastrar.component';
import { BtnExcluirComponent } from '../../shared/btn-excluir/btn-excluir.component';
import { BtnGridEditarComponent } from '../../shared/grid/btn-grid-editar/btn-grid-editar.component';
import { BtnGridExcluirComponent } from '../../shared/grid/btn-grid-excluir/btn-grid-excluir.component';
import { BtnGridVisualizarComponent } from '../../shared/grid/btn-grid-visualizar/btn-grid-visualizar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-entregas-list',
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
    CommonModule,
    LoadingComponent
  ],
  providers : [DatePipe],
  templateUrl: './entregas-list.component.html',
  styleUrl: './entregas-list.component.scss'
})
export class EntregasListComponent implements OnInit{

  descricao : any = ''
  dataIni : any;
  dataFim : any
  status : any= ''
  rows : any[] = []
  btnExcluir : boolean = false
  deleteEntrega : any

  ColumnMode = ColumnMode;

  loading : boolean = false

  constructor(private service : PesquisaService, private router : Router, 
    private entregaService : EntregasService, private datePipe: DatePipe){}
  
  
    ngOnInit(): void {
      this.dataIni = this.datePipe.transform(Date.now() - 2592000000, 'yyyy-MM-dd')
      this.dataFim = this.datePipe.transform(Date.now(), 'yyyy-MM-dd')
      this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.entregaService.pesquisaEntregas(
      this.descricao,
      this.dataIni,
      this.dataFim,
      this.status
    ).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  cadastrarEntrega(){
    this.router.navigate(['entregas/novo'])
  }

  excluir(row : any){
    this.btnExcluir = true
    this.deleteEntrega = row
  }

  excluirEntrega(){
    this.btnExcluir = false
    this.entregaService.deleteEntrega(this.deleteEntrega.id).subscribe(()=>{
      this.pesquisar()
    },
    ()=>{
    })
  }

  editar(row : any){
    this.router.navigate(['entregas/editar/'+row.id])
  }
  
  visualizar(row : any){
    this.router.navigate(['entregas/'+row.id])
  }

  getCellClass({ row, column, value }: any): any{
    console.log(value)
    if(value == 'PENDENTE'){
      return 'text-success'
    }else if(value == 'TRANSITO'){
      return 'text-warning'
    }else if(value == 'ENTREGUE'){
      return 'text-primary'
    }
  }

}
