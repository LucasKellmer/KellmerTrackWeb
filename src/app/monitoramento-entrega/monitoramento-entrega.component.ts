import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MonitoramentoService } from '../monitoramento/monitoramento.service';

@Component({
  selector: 'app-monitoramento-entrega',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    CommonModule,
  ],
  templateUrl: './monitoramento-entrega.component.html',
  styleUrl: './monitoramento-entrega.component.scss'
})


export class MonitoramentoEntregaComponent implements OnInit {
  
  @Input("entrega") entrega: any;
  @Input("verEntrega") verEntrega: boolean = false;
  rotacoes : any[] = []
  rotacoesAgrupadas : Array<any> = []

  constructor(private monitoramentoService : MonitoramentoService){
  }

  ngOnInit(): void {
  }

  buscaRotacoesByEntrega(veiculo : any){
    if(veiculo != 0){
      this.monitoramentoService.buscaRotacoesByVeiculo(veiculo).subscribe((data : any) =>{
        this.rotacoes = data
        console.log("rotacoes:")
        console.log(this.rotacoes)
        const groups = this.rotacoes.reduce((groups, rotacao) => {
          const date = rotacao.momento.split('.')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(rotacao);
          return groups;
        }, {});
        
        console.log("Rotacoes filtradas:")
        console.log(groups)

        this.rotacoesAgrupadas = Object.keys(groups).map((date : any) => {
          return {
            date,
            games: groups[date]
          };
        });

        console.log("Rotacoes filtradas array:")
        console.log(this.rotacoesAgrupadas)
      })
    }else{
      this.rotacoes = []
    }
  }
}
