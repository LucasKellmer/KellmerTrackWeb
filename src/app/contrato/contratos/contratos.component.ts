import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../contratos.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PesquisaService } from '../../pesquisa.service';
import { ToastService } from '../../shared/toast/toast.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent,
    LoadingComponent,
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
    this.loading = true
    this.contratoService.findContratoByNumero(this.contratoNumero).subscribe((contrato : any)=>{
      console.log(this.contratoNumero)
      console.log(contrato)
      this.contratoForm = this.formBuider.group({
        numero : contrato.numero,
        cliente : contrato.cliente,
        empresa : contrato.empresa,
        obra : contrato.obra,
      })
      this.buscaCliente()
      this.buscaEmpresas()
      this.buscaObras()
      this.loading = false
    })
  }

  visualizar(){
    this.visualizaContrato = true
    this.loading = true
    this.contratoService.findContratoByNumero(this.contratoNumero).subscribe((contrato : any)=>{
      this.contratoForm = this.formBuider.group({
        numero : contrato.numero,
        cliente : contrato.cliente,
        empresa : contrato.empresa,
        obra : contrato.obra
      })
      this.buscaCliente()
      this.buscaEmpresas()
      this.buscaObras()
      this.desabilitaCombobox()
      this.loading = false
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
    this.contratoService.findContratoByNumero(numero).subscribe((dados : any)=>{
      console.log("valida número contrato: ")
      console.log(dados)
      console.log("Número:")
      console.log(numero)
      if(dados != null && numero != ''){
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um contrato cadastrado com esse número"
        this.contratoForm.controls['numero'].setErrors({'incorrect': true });
        this.contratoForm.controls['numero'].markAsTouched()
      }
      else
        this.contratoForm.controls['numero'].setErrors(null);
    })
  }

  async cadastrarContrato(){
    this.submitted = true
    await this.validaCampos()
    console.log("this.contratoForm.valid = "+this.contratoForm.valid)
    console.log(this.contratoForm)
    if(this.contratoForm.valid){
      this.loading = true
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
        this.loading = false
      },()=>{
        this.loading = false
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
