import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MonitoramentoService } from '../../monitoramento/monitoramento.service';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { NgIf, NgFor, CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { TrajetosMenuComponent } from '../trajetos-menu/trajetos-menu.component';
import { TrajetoService } from '../trajeto.service';
import { ActivatedRoute } from '@angular/router';
import { EntregasService } from '../../entrega/entregas.service';

@Component({
  selector: 'app-trajetos',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    HeaderComponent,
    TrajetosMenuComponent,
    GoogleMapsModule,
    CommonModule,
  ],
  templateUrl: './trajetos.component.html',
  styleUrl: './trajetos.component.scss'
})
export class TrajetosComponent implements OnInit, AfterViewInit{

  @ViewChild(GoogleMap) map!: GoogleMap;

  trajetoId: any
  veiculo : any
  momento : any
  dataTrajeto : any
  display: any;
  marker!: google.maps.Marker;
  locations : any[] = [];
  rotacoes : any[] = []
  currentLocation : any = { latitude: 0, longitude: 0, velocidade:0, momento: Date() }
  filteredLocations: any[] = [];

  isPaused: boolean = false;
  animationFrameId: number | null = null;
  index: number = 0;
  step: number = 0;

  horaIni: string = '';
  horaFim: string = '';
  velocidadeTrajeto: any = 50;
  datepipe: DatePipe = new DatePipe('en-US')

  usinas: any[] = [];
  entregas : any[] = []
  showEntregas : boolean = true

  private polyline: google.maps.Polyline | null = null;
  
  center: google.maps.LatLngLiteral = {
      lat: -26.22615680,
      lng: -51.09093892
  };

  styles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#c6c6c6" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#abcce6" }]
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ 
        visibility: "off" 
    }]}
  ];

  mapOptions: google.maps.MapOptions = {
    zoom: 17,
    disableDefaultUI: true,
    styles: this.styles
  };

  veiculoIcon = {
    url: "../assets/icon_betoneira2.png",
    labelOrigin: new google.maps.Point(40,90),
    scaledSize: new google.maps.Size(80, 80),
    origin: new google.maps.Point(0, -20)
  }

  usinaIcon = {
    url: "../assets/icon_usina.svg",
    labelOrigin: new google.maps.Point(25,100),
    scaledSize: new google.maps.Size(50, 90),
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

  constructor(private service: TrajetoService, private activatedRoute: ActivatedRoute, private entregaService : EntregasService, private monitoramentoService : MonitoramentoService) {}

  ngOnInit(): void {
    this.trajetoId = this.activatedRoute.snapshot.paramMap.get("id")
  }

  ngAfterViewInit() {
    this.buscaTrajeto()
    this.buscaUsinas()
  }

  buscaTrajeto(){
    this.service.buscaTrajetoById(this.trajetoId).subscribe((dados:any)=>{
      console.log(dados)
      if (dados.trajeto.length > 0) {
        this.center = {
          lat: dados.trajeto[0].latitude!,
          lng: dados.trajeto[0].longitude!
        };
        this.currentLocation.latitude = dados.trajeto[0].latitude
        this.currentLocation.longitude = dados.trajeto[0].longitude
        this.currentLocation.momento = dados.trajeto[0].velocidade
        this.currentLocation.momento = dados.trajeto[0].momento
        this.locations = dados.trajeto
        this.veiculo = dados.veiculo
        this.rotacoes = dados.rotacoes
        this.dataTrajeto = this.datepipe.transform(dados.data, 'yyyy-MM-dd')
        this.buscaEntregas(this.dataTrajeto)
        

        //centraliza a tela nessa localização
        this.map.panTo(this.center);
      }
    })
  }

  buscaEntregas(data : any){
    this.entregaService.findEntregasByData(data).subscribe((dados:any)=>{
      console.log(dados)
      this.entregas = dados
    })
  }

  buscaUsinas(){
    this.monitoramentoService.buscaUsinas().subscribe((dados:any)=>{
      this.usinas = dados
    })
  }
  
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  loadPolyline(locations: any[]) {
    if (this.polyline) {
      this.polyline.setMap(null);
    }

    const pathCoordinates = locations
      .filter(location => location.latitude !== null && location.longitude !== null)
      .map(location => ({
        lat: location.latitude!,
        lng: location.longitude!,
      }));

    this.polyline = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    this.polyline.setMap(this.map.googleMap!);
  }


  startSimulation() {
    if (this.isPaused) {
      this.isPaused = false;
      this.animate();
    } else {
      this.index = 0;
      this.step = 0;
      this.simulateMovement();
    }
  }

  simulateMovement() {
    this.index = 0;
    this.step = 0;
    this.animate();
  }

  animate() {

    if (this.index < this.filteredLocations.length - 1) {
      const start = {
        lat: this.filteredLocations[this.index].latitude!,
        lng: this.filteredLocations[this.index].longitude!
      };
      const end = {
        lat: this.filteredLocations[this.index + 1].latitude!,
        lng: this.filteredLocations[this.index + 1].longitude!
      };

      if (this.step <= this.velocidadeTrajeto) {
        const lat = start.lat + (end.lat - start.lat) * (this.step / this.velocidadeTrajeto);
        const lng = start.lng + (end.lng - start.lng) * (this.step / this.velocidadeTrajeto);
        this.currentLocation.latitude = lat
        this.currentLocation.longitude = lng
        this.currentLocation.velocidade = this.filteredLocations[this.index].velocidade
        this.currentLocation.momento = this.filteredLocations[this.index].momento
        this.step++;

        if (!this.isPaused) {
          this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
      } else {
        this.index++;
        this.step = 0;
        this.animate();
      }
    }
  }

  btnPlayClicked(){
    if (this.isPaused) {
      this.isPaused = false;
      this.animate();
    } else {
      this.index = 0;
      this.step = 0;
      this.simulateMovement();
    }
  }

  btnPauseClicked(){
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  btnMontarTrajetoClicked(filtro:any) {
    if (filtro.horaIni && filtro.horaFim) {
        const [startHour, startMinute] = filtro.horaIni.split(':').map(Number);
        const [endHour, endMinute] = filtro.horaFim.split(':').map(Number);
        
       const start = new Date();
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMinute, 59, 999);

        this.filteredLocations = this.locations.filter(location => {
            const momento = new Date(location.momento);
            const momentoHour = momento.getHours();
            const momentoMinute = momento.getMinutes();

            return (momentoHour > startHour || (momentoHour === startHour && momentoMinute >= startMinute)) &&
                   (momentoHour < endHour || (momentoHour === endHour && momentoMinute <= endMinute));
        });

        console.log(this.filteredLocations);

        this.loadPolyline(this.filteredLocations);
    }
  }

  alteraVelocidadeTrajeto(velocidade : any){
    this.velocidadeTrajeto = velocidade
  }

  mostrarEntregas(value : any){
    this.showEntregas = value
  }

  getLabelVeiculo(){
    var momento = new Date(this.currentLocation.momento)
    var dataAjustada = new Date(momento.getTime() - 3 * 60 * 60 * 1000)
    return `${this.datepipe.transform(dataAjustada, 'HH:mm')} h - ${this.currentLocation.velocidade} km/h`
  }
}