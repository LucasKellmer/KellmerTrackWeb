import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BtnGridVisualizarComponent } from '../../shared/grid/btn-grid-visualizar/btn-grid-visualizar.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BtnCadastrarComponent } from '../../shared/btn-cadastrar/btn-cadastrar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TrajetoService } from '../trajeto.service';

@Component({
  selector: 'app-trajetos-list',
  standalone: true,
  imports: [
    NgxDatatableModule,
    HeaderComponent,
    NgIf, NgFor, FormsModule,
    BtnGridVisualizarComponent,
    BtnCadastrarComponent,
    LoadingComponent
  ],
  templateUrl: './trajetos-list.component.html',
  styleUrl: './trajetos-list.component.scss'
})
export class TrajetosListComponent implements OnInit{
  ColumnMode = ColumnMode;
  loading : boolean = false
  dataIni : any;
  dataFim : any
  rows : any[] = []
  veiculo : any = ''
  datepipe: DatePipe = new DatePipe('en-US')

  constructor(private router: Router, private service : TrajetoService){}
  ngOnInit(): void {
    this.dataIni = this.datepipe.transform(Date.now() - 129600000, 'yyyy-MM-dd')
    this.dataFim = this.datepipe.transform(Date.now(), 'yyyy-MM-dd')
    this.pesquisar()
  }

  pesquisar(){
    this.loading = true
    this.service.buscaTrajetos(this.veiculo, this.dataIni, this.dataFim).subscribe((dados : any)=>{
      this.rows = dados
      this.loading = false
    })
  }

  visualizar(id: number){
    this.router.navigate(['trajetos/' + id]);
  }
}
