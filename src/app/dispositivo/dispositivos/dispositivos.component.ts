import { Component, OnInit } from '@angular/core';
import { PesquisaService } from '../../pesquisa.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DispositivoService } from '../dispositivo.service';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent
  ],
  templateUrl: './dispositivos.component.html',
  styleUrl: './dispositivos.component.scss'
})
export class DispositivosComponent implements OnInit {

  dispositivoForm! : UntypedFormGroup
  dispositivoNumeroInterno : any
  motoristas : any
  motoritasLoading : boolean = false
  veiculos : any
  veiculosLoading : boolean = false
  submitted = false;
  numeroInternoErro : boolean = false
  veiculoErro : boolean = false
  empresas : any
  empresasLoading : boolean = false
  macErro: boolean = false
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editaDispositivo : boolean = false
  visualizaDispositivo : boolean = false
  loading : boolean = false

  tituloToast : any
  msgToast : any
  tipoToast : any

  constructor(private service : PesquisaService, private router : Router, private formBuider : UntypedFormBuilder, 
    private dispositivoService : DispositivoService,  private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    ){
  }

  ngOnInit(): void {
    this.dispositivoForm = this.formBuider.group({
      numeroInterno : new UntypedFormControl('', [Validators.required]),
      motorista : new UntypedFormControl('', [Validators.required]),
      veiculo : new UntypedFormControl('', [Validators.required]),
      modelo : new UntypedFormControl('', [Validators.required]),
      mac : new UntypedFormControl('', [Validators.required]),
      dataVinculo : new UntypedFormControl(''),
      empresa : new UntypedFormControl('', [Validators.required]),
    })
    this.dispositivoNumeroInterno = this.activatedRoute.snapshot.paramMap.get("numeroInterno")
    console.log("dispositivoNumeroInterno: "+ this.dispositivoNumeroInterno)
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.buscaMotorista()
      this.buscaVeiculos()
      this.buscaEmpresas()
      this.visualizaDispositivo = false
      this.editaDispositivo = false
    }
  }

  buscaMotorista(){
    this.motoritasLoading = true
    this.service.consultar('motoristas').subscribe((dados : any)=>{
      this.motoristas = dados
      this.motoritasLoading = false
    })
  }

  buscaVeiculos(){
    this.veiculosLoading = true
    this.service.consultar('veiculos').subscribe((dados: any)=>{
      this.veiculos = dados
      this.veiculosLoading = false
    })
  }

  buscaEmpresas(){
    this.empresasLoading = true
    this.service.consultar('empresas').subscribe((dados: any)=>{
      this.empresas = dados
      this.empresasLoading = false
    })
  }

  /*showToast(){
    this.bsModalRef = this.modalService.show(ToastComponent);
    this.bsModalRef.content.type = 'danger';
    this.bsModalRef.content.message = 'teste';
  }*/

  editar(){
    this.editaDispositivo = true
    this.dispositivoService.findDispositivoByNumeroInterno(this.dispositivoNumeroInterno).subscribe((dispositivo : any)=>{
      console.log(dispositivo)
      this.dispositivoForm = this.formBuider.group({
        numeroInterno : dispositivo.numeroInterno,
        motorista : dispositivo.motoristaId,
        veiculo : dispositivo.veiculo,
        modelo : dispositivo.modelo,
        mac : dispositivo.mac,
        dataVinculo : dispositivo.dataVinculo,
        empresa : dispositivo.empresa,
      })
      this.buscaMotorista()
      this.buscaVeiculos()
      this.buscaEmpresas()
    })
  }

  visualizar(){
    this.visualizaDispositivo = true
    this.dispositivoService.findDispositivoByNumeroInterno(this.dispositivoNumeroInterno).subscribe((dispositivo : any)=>{
      this.dispositivoForm = this.formBuider.group({
        numeroInterno : dispositivo.numeroInterno,
        motorista : dispositivo.motoristaId,
        veiculo : dispositivo.veiculo,
        modelo : dispositivo.modelo,
        mac : dispositivo.mac,
        dataVinculo : dispositivo.dataVinculo,
        empresa : dispositivo.empresa,
      })
      this.buscaMotorista()
      this.buscaVeiculos()
      this.buscaEmpresas()
      this.desabilitaCombobox()
    })
  }

  desabilitaCombobox(){
    this.dispositivoForm.get('veiculo')?.disable();
    this.dispositivoForm.get('motorista')?.disable();
    this.dispositivoForm.get('modelo')?.disable();
    this.dispositivoForm.get('empresa')?.disable();
  }

  voltar(){
    this.router.navigate(['dispositivos'])
  }

  async validaNumeroInterno(){
    const numeroInterno = this.dispositivoForm.get('numeroInterno')?.value
    this.dispositivoService.validaNumeroInterno(numeroInterno).subscribe((dados : any)=>{
      console.log(dados)
      if(dados != null && numeroInterno != ''){
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse número interno"
        this.numeroInternoErro = true
      }
    })
  }

  async validaMac(){
    const mac = this.dispositivoForm.get('mac')?.value
    this.dispositivoService.validaMac(mac).subscribe((dados : any)=>{
      console.log(dados)
      if(dados != null && mac != ''){
        this.msgErro = true
        //this.macErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse mac"
      }
    })
  }

  async validaVeiculo(){
    const veiculo = this.dispositivoForm.get('veiculo')?.value
    this.dispositivoService.validaVeiculo(veiculo).subscribe((dados : any)=>{
      console.log("Veículo encontrado: "+dados)
      if(dados != null && veiculo != ''){
        this.msgErro = true
        //this.veiculoErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse veículo"
      }
    })
  }

  async validaMotorista(){
    const motorista = this.dispositivoForm.get('motorista')?.value
    this.dispositivoService.validaMotorista(motorista).subscribe((dados : any)=>{
      console.log("Motrista encontrado: "+dados)
      if(dados != null && motorista != ''){
        this.msgErro = true
        //this.motoristaErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse motorista"
      }
    })
  }

  async cadastrarDispositivo(){
    this.submitted = true
    await this.validaCampos()
    console.log("this.dispositivoForm.valid = "+this.dispositivoForm.valid)
    if(this.dispositivoForm.valid){
      const formJson : any = {
        numeroInterno : this.dispositivoForm.get('numeroInterno')?.value,
        motoristaId : this.dispositivoForm.get('motorista')?.value,
        veiculo : this.dispositivoForm.get('veiculo')?.value,
        modelo : this.dispositivoForm.get('modelo')?.value,
        mac : this.dispositivoForm.get('mac')?.value,
        empresa : this.dispositivoForm.get('empresa')?.value
      }

      console.log(formJson)
      this.dispositivoService.postDispositivo(formJson).subscribe(()=>{
        if(this.dispositivoNumeroInterno == 'novo'){
          this.exibirToast()
        }else{
          this.exibirToast()
        }
        this.dispositivoForm.reset()
        this.voltar()
      },()=>{
      })
    }
  }

  apagaVinculo(){
    const numeroInterno = this.dispositivoForm.get('numeroInterno')?.value
    this.dispositivoService.apagaVinculo(numeroInterno).subscribe(()=>{
      this.dispositivoForm.controls['dataVinculo'].setValue("")
    })
  }

  showSuccessToast(): void {
    this.toastService.showToast('Success', 'This is a success message.');
  }

  showErrorToast(): void {
    this.toastService.showToast('Error', 'This is an error message.');
  }

  exibirToast() {
    this.toastService.showToast('Título do Toast', 'Mensagem do Toast');
  }

  async validaCampos() {
    (<any>Object).values(this.dispositivoForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    if(!this.editar){
      this.validaNumeroInterno()
      this.validaMac()
      this.validaVeiculo()
      this.validaMotorista()
    }
  }

}
