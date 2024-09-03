import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../contratos.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PesquisaService } from '../../pesquisa.service';
import { ToastService } from '../../shared/toast/toast.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent
  ],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.scss'
})
export class ContratosComponent implements OnInit {

  contratoForm! : UntypedFormGroup
  contratoNumero : any
  clientes : any
  clientesLoading : boolean = false
  empresas : any
  empresasLoading : boolean = false
  obras : any
  obrasLoading : boolean = false
  submitted = false;
  numeroErro : boolean = false
  empresaErro : boolean = false
  clienteErro: boolean = false
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editaContrato : boolean = false
  visualizaContrato : boolean = false
  loading : boolean = false

  tituloToast : any
  msgToast : any
  tipoToast : any

  constructor(private service : PesquisaService, private router : Router, private formBuider : UntypedFormBuilder, 
    private contratoService : ContratosService,  private activatedRoute: ActivatedRoute,
    ){
  }

  ngOnInit(): void {
    this.contratoForm = this.formBuider.group({
      numero : new UntypedFormControl('', [Validators.required]),
      cliente : new UntypedFormControl('', [Validators.required]),
      empresa : new UntypedFormControl('', [Validators.required]),
      obra : new UntypedFormControl('', [Validators.required]),
    })
    this.contratoNumero = this.activatedRoute.snapshot.paramMap.get("numero")
    console.log("contratoNumero: "+ this.contratoNumero)
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.buscaCliente()
      this.buscaEmpresas()
      this.buscaObras()
      this.visualizaContrato = false
      this.editaContrato = false
    }
  }

  buscaCliente(){
    this.clientesLoading = true
    this.service.consultar('clientes').subscribe((dados : any)=>{
      this.clientes = dados
      this.clientesLoading = false
    })
  }

  buscaEmpresas(){
    this.empresasLoading = true
    this.service.consultar('empresas').subscribe((dados: any)=>{
      this.empresas = dados
      this.empresasLoading = false
    })
  }

  buscaObras(){
    this.obrasLoading = true
    this.service.consultar('obras').subscribe((dados: any)=>{
      this.obras = dados
      this.obrasLoading = false
    })
  }

  editar(){
    this.editaContrato = true
    this.contratoService.findContratoByNumero(this.contratoNumero).subscribe((dispositivo : any)=>{
      console.log(dispositivo)
      this.contratoForm = this.formBuider.group({
        numero : dispositivo.numero,
        cliente : dispositivo.clienteId,
        empresa : dispositivo.empresa,
        obra : dispositivo.obra,
      })
      this.buscaCliente()
      this.buscaEmpresas()
      this.buscaObras()
    })
  }

  visualizar(){
    this.visualizaContrato = true
    this.contratoService.findContratoByNumero(this.contratoNumero).subscribe((dispositivo : any)=>{
      this.contratoForm = this.formBuider.group({
        numero : dispositivo.numero,
        cliente : dispositivo.clienteId,
        empresa : dispositivo.empresa,
        obra : dispositivo.obra
      })
      this.buscaCliente()
      this.buscaEmpresas()
      this.desabilitaCombobox()
    })
  }

  desabilitaCombobox(){
    this.contratoForm.get('empresa')?.disable();
    this.contratoForm.get('cliente')?.disable();
    this.contratoForm.get('obra')?.disable();
  }

  voltar(){
    this.router.navigate(['contratos'])
  }

  async validaNumeroContrato(){
    const numero = this.contratoForm.get('numero')?.value
    console.log("numero: "+numero)
    this.contratoService.findContratoByNumero(numero).subscribe((dados : any)=>{
      console.log("dados: ")
      console.log(dados)
      if(dados != null && numero != ''){
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um contrato cadastrado com esse número"
        this.contratoForm.controls['numero'].setErrors({'incorrect': true });
        this.contratoForm.controls['numero'].markAsTouched()
      }
      else
        this.contratoForm.controls['numero'].setErrors({'incorrect': false });
    })
  }
  /*async validaNumeroInterno(){
    const numero = this.contratoForm.get('numero')?.value
    this.contratoService.validaNumeroInterno(numero).subscribe((dados : any)=>{
      console.log(dados)
      if(dados != null && numero != ''){
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse número interno"
        this.numeroErro = true
      }
    })
  }

  async validaMac(){
    const mac = this.contratoForm.get('mac')?.value
    this.contratoService.validaMac(mac).subscribe((dados : any)=>{
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
    const empresa = this.contratoForm.get('empresa')?.value
    this.contratoService.validaVeiculo(empresa).subscribe((dados : any)=>{
      console.log("Veículo encontrado: "+dados)
      if(dados != null && empresa != ''){
        this.msgErro = true
        //this.empresaErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse veículo"
      }
    })
  }

  async validaMotorista(){
    const cliente = this.contratoForm.get('cliente')?.value
    this.contratoService.validaMotorista(cliente).subscribe((dados : any)=>{
      console.log("Motrista encontrado: "+dados)
      if(dados != null && cliente != ''){
        this.msgErro = true
        //this.clienteErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um dispositivo cadastrado com esse cliente"
      }
    })
  }*/

  async cadastrarContrato(){
    this.submitted = true
    await this.validaCampos()
    console.log("this.contratoForm.valid = "+this.contratoForm.valid)
    if(this.contratoForm.valid){
      const formJson : any = {
        numero : this.contratoForm.get('numero')?.value,
        cliente : this.contratoForm.get('cliente')?.value,
        empresa : this.contratoForm.get('empresa')?.value,
        obra : this.contratoForm.get('obra')?.value,
      }

      console.log(formJson)
      this.contratoService.postContrato(formJson).subscribe(()=>{
        this.contratoForm.reset()
        this.voltar()
      },()=>{
      })
    }
  }

  async validaCampos() {
    (<any>Object).values(this.contratoForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    /*this.validaNumeroInterno()
    this.validaMac()
    this.validaVeiculo()
    this.validaMotorista()*/
  }
}
