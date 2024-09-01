import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { EntregasService } from '../../entrega/entregas.service';

@Component({
  selector: 'app-trajetos-menu',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule,
    FormsModule, 
    CommonModule,
  ],
  templateUrl: './trajetos-menu.component.html',
  styleUrl: './trajetos-menu.component.scss'
})

export class TrajetosMenuComponent {

  @Output() playClick = new EventEmitter<any>();
  @Output() pauseClick = new EventEmitter<any>();
  @Output() montarTrajetoClick = new EventEmitter<any>();
  @Output() velocidadeTrajetoClick = new EventEmitter<any>();
  @Output() showEntregas = new EventEmitter<any>();

  @Input() veiculo : any
  @Input() dataTrajeto: any
  @Input("rotacoes") rotacoes: Array<any> = [];
  rotacoesPorEntrega : Array<any> = []
  @Input() entregas: Array<any> = [];

  horaIni : any = "00:00";
  horaFim : any = "23:59";

  rotacaoPorDia : boolean = false;
  rotacaoPorEntrega : boolean = true;
  datepipe: DatePipe = new DatePipe('en-US')
  verRotacoesPorEntrega : boolean = false

  x : any = "1";

  constructor(private router: Router){}

  btnPlay(){
    this.playClick.emit()
  }

  btnPause(){
    this.pauseClick.emit()
  }

  btnMontarTrajeto(){
    const filtro = {
      horaIni : this.horaIni,
      horaFim : this.horaFim
    }
    this.montarTrajetoClick.emit(filtro)
  }

  velocidadeTrajeto(velocidade : any, x : any){
    this.x = x
    this.velocidadeTrajetoClick.emit(velocidade)
  }

  voltar(){
    this.router.navigate(['trajetos']);
  }

  verPorDia(){
    this.showEntregas.emit(false)
    this.rotacaoPorDia = true;
    this.rotacaoPorEntrega = false;
  }
  
  verPorEntrega(){
    this.showEntregas.emit(true)
    this.rotacaoPorEntrega = true;
    this.rotacaoPorDia = false;
  }

  btnExpandir(entrega : any){
    console.log(entrega)
    console.log(this.rotacoes)
    this.verRotacoesPorEntrega = !this.verRotacoesPorEntrega

    if (this.verRotacoesPorEntrega) {
      const entradaUsina = new Date(entrega.dataEntradaUsina).getTime();
      const saidaUsina = new Date(entrega.dataSaidaUsina).getTime();
      this.rotacoesPorEntrega = this.rotacoes.filter(rotacao => {
          const momentoRotacao = new Date(rotacao.momento).getTime();
          console.log(momentoRotacao)
          console.log(entradaUsina)
          console.log(saidaUsina)
          return momentoRotacao >= saidaUsina && momentoRotacao <= entradaUsina;
      });
    }
  }
}
