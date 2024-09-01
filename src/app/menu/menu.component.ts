import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  constructor(private router : Router){}

  ngOnInit(): void {
    this.abreFechaMenu()
  }

  abreFechaMenu(){
    if (typeof document !== 'undefined') {
      document.querySelector("#sidebar")?.classList.toggle("expand");
    }

  }

  telaDispositivos(){
    this.router.navigate(['dispositivos'])
  }

  telaMotoristas(){
    this.router.navigate(['motoristas'])
  }

  telaVeiculos(){
    this.router.navigate(['veiculos'])
  }

  telaEntregas(){
    this.router.navigate(['entregas'])
  }

  telaMonitoramento(){
    this.router.navigate(['monitoramento'])
  }

  telaTrajetos(){
    this.router.navigate(['trajetos'])
  }
}
