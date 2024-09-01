import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoramento-menu',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    CommonModule,
  ],
  templateUrl: './monitoramento-menu.component.html',
  styleUrl: './monitoramento-menu.component.scss'
})
export class MonitoramentoMenuComponent implements OnInit{

  @Input("veiculos") veiculos: Array<any> = [];

  @Output() veiculoHover = new EventEmitter<any>();

  @Output() veiculoClick = new EventEmitter<any>();
  
  menuExpanded : Boolean = true;
  showCards : Boolean = true;

  ngOnInit(): void {
  }

  expandirMenu(){
    console.log("veiculos recebidos")
    console.log(this.veiculos)
    this.menuExpanded = !this.menuExpanded
    if(this.menuExpanded){
      setTimeout(() => {
        this.showCards = !this.showCards
      }, 150)
    }else{
      this.showCards = !this.showCards
    }
  }

  veiculoClicked(veiculo : any){
    this.veiculoClick.emit(veiculo)
  }
}
