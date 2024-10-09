import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MonitoramentoService } from '../monitoramento/monitoramento.service';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-monitoramento-entrega',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule , 
    LoadingComponent,
    NgIf, NgFor, 
    ReactiveFormsModule,
  ],
  templateUrl: './monitoramento-entrega.component.html',
  styleUrl: './monitoramento-entrega.component.scss'
})


export class MonitoramentoEntregaComponent implements OnInit {
  
  @Input("entrega") entrega: any;
  @Input("verEntrega") verEntrega: boolean = false;
  rotacoes : any[] = []
  loading : boolean = false;
  veiculoSelecionado : string = ''

  constructor(private monitoramentoService : MonitoramentoService){
  }

  ngOnInit(): void {
  }

  buscaRotacoesByEntrega(veiculo : any){
    if(veiculo != 0){
      this.rotacoes = []
      this.loading = true
      let veiculoSelected = (veiculo == null) ? this.veiculoSelecionado : veiculo
      this.monitoramentoService.buscaRotacoesByVeiculo(veiculoSelected).subscribe((data : any) =>{
        this.rotacoes = data
        console.log("rotacoes:")
        console.log(this.rotacoes)
        
        this.veiculoSelecionado = veiculoSelected
        this.loading = false
      })
    }else{
      this.rotacoes = []
    }
  }
}
