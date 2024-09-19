import { NgIf, NgFor, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { MonitoramentoMenuComponent } from '../monitoramento-menu/monitoramento-menu.component';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MonitoramentoService } from './monitoramento.service';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { MonitoramentoEntregaComponent } from '../monitoramento-entrega/monitoramento-entrega.component';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-monitoramento',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    HeaderComponent,
    MonitoramentoMenuComponent,
    MonitoramentoEntregaComponent,
    GoogleMapsModule,
    CommonModule,
  ],
  templateUrl: './monitoramento.component.html',
  styleUrl: './monitoramento.component.scss'
})
export class MonitoramentoComponent implements OnInit{

  @ViewChild(GoogleMap) map !: GoogleMap;
  @ViewChild(MonitoramentoEntregaComponent) monitoramentoEntrega!: MonitoramentoEntregaComponent

  veiculos: any = [];

  usinas: any = [];

  entregas: any = [];

  entregaSelected : any;

  verEntrega : boolean = false;

  styles = [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{ 
          visibility: "off" 
        }]
      }]

  mapOptions: google.maps.MapOptions = {
    zoom:17,
    disableDefaultUI: true,
    styles: this.styles
  };

  usinaIcon = {
    url: "../assets/icon_usina.svg",
    labelOrigin: new google.maps.Point(25,100),
    scaledSize: new google.maps.Size(50, 90),
    origin: new google.maps.Point(0, -20)
  }

  veiculoIcon = {
    url: "../assets/icon_betoneira2.png",
    labelOrigin: new google.maps.Point(40,90),
    scaledSize: new google.maps.Size(80, 80),
    origin: new google.maps.Point(0, -20)
  }

  entregaIcon = {
    url: "../assets/icon_obra.svg",
    labelOrigin: new google.maps.Point(25,100),
    scaledSize: new google.maps.Size(50, 90),
    origin: new google.maps.Point(0, -25)
  }

  circleOptions: google.maps.CircleOptions = {
    fillColor: 'rgba(255, 0, 0, 0.2)',
    strokeColor: 'rgba(255, 0, 0, 0.5)',
    strokeWeight: 2,
  };

  circleOptionsEntregue: google.maps.CircleOptions = {
    fillColor: 'rgba(0, 119, 0, 0.2)',
    strokeColor: 'rgba(0, 119, 0, 0.5)',
    strokeWeight: 2,
  };

  messageSubscription: Subscription = new Subscription()

  constructor(private monitoramentoService : MonitoramentoService, private socket: SocketService){}

  ngOnInit(): void {
    localStorage.setItem('user', '1234')
    this.socket.connect()
    this.subscribeSocketMessages()

    this.buscaVeiculos()
    this.buscaUsinas()
    this.buscaEntregas()
  }

  subscribeSocketMessages() {
    this.messageSubscription = this.socket.messageSubject.subscribe(message => {
      console.log(message)
      let mensagemJson = JSON.parse(message)
      console.log(mensagemJson.type)
      let messageMessageJson = JSON.parse(mensagemJson.message)

      if(mensagemJson.type == "LOCALIZACAO"){
        let veiculo = this.veiculos.find((x : any )=> x.veiculo === messageMessageJson.veiculoId)
        this.moveVeiculo(veiculo, messageMessageJson)
      }else if(mensagemJson.type == "ENTREGA"){
        let entrega = this.entregas.find((x:any) => x.id === messageMessageJson.id)
        if (entrega && this.entregaSelected) {
          let status;
          if (messageMessageJson.status == 0) {
              status = "PENDENTE";
          } else if (messageMessageJson.status == 1) {
              status = "TRANSITO";
          } else if (messageMessageJson.status == 2) {
              status = "ENTREGUE";
          } else{
              status = "FINALIZADO"
          }
          this.entregaSelected.status = status
        }
      }
    })
  }

  display: any;
  
  center: google.maps.LatLngLiteral = {
      lat: -26.22615680,
      lng: -51.09093892
  };

  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  moveVeiculo(localizacaoAtual: any, localizacaoNova: any) {
    if (localizacaoNova.latitude != null && localizacaoNova.longitude != null) {
      this.animateVeiculo(localizacaoAtual.ultimaLocalizacao, localizacaoNova)
    }
  }

  animateVeiculo(localizacaoAtual: any, localizacaoNova: any, duration: number = 500) {
    const startLat = localizacaoAtual.latitude;
    const startLng = localizacaoAtual.longitude;
    const endLat = localizacaoNova.latitude;
    const endLng = localizacaoNova.longitude;
  
    const startTime = performance.now();
  
    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
  
      localizacaoAtual.latitude = startLat + (endLat - startLat) * progress;
      localizacaoAtual.longitude = startLng + (endLng - startLng) * progress;
  
      this.veiculos = [...this.veiculos];
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  buscaVeiculos(){
    this.monitoramentoService.listVeiculos().subscribe(data => {
      console.log(data)
      this.veiculos = data
    })
  }

  buscaUsinas(){
    this.monitoramentoService.buscaUsinas().subscribe(data => {
      this.usinas = data
    })
  }

  buscaEntregas(){
    this.monitoramentoService.buscaEntregas().subscribe(data => {
      this.entregas = data
    })
  }

  veiculoHover(){
    
  }

  veiculoSelected(veiculo : any){

    this.veiculos.forEach((x : any) => {
      if(x != veiculo)
        x.selected = false
    })

    veiculo.selected = !veiculo.selected

    if(veiculo.selected)
      this.verEntrega = true
    else
      this.verEntrega = false

    this.entregaSelected = undefined
    this.entregaSelected = this.entregas.find((x: any) => x.veiculo === veiculo.veiculo);

    this.center = {
      lat: veiculo.ultimaLocalizacao.latitude,
      lng: veiculo.ultimaLocalizacao.longitude
    };
    
    if (this.map) {
      this.map.googleMap!.setCenter(this.center);
    }

    if(this.entregaSelected != undefined){
      console.log("=========== this.entregaSelected")
      console.log(this.entregaSelected)
      //this.monitoramentoEntrega.buscaRotacoesByEntrega(this.entregaSelected.id)
      this.monitoramentoEntrega.buscaRotacoesByEntrega(this.entregaSelected.veiculo)
    }else{
      this.monitoramentoEntrega.buscaRotacoesByEntrega(0)
    }
  }

  getCircleOptions(): google.maps.CircleOptions {
    if (this.entregaSelected && this.entregaSelected.status === 'ENTREGUE') {
      return this.circleOptionsEntregue;
    } else {
      return this.circleOptions;
    }
  }
}
