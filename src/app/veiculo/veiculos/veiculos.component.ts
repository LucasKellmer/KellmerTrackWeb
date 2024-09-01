import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VeiculoService } from '../veiculo.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule, 
    HeaderComponent,
    CommonModule,
    MsgModalComponent,
    LoadingComponent
  ],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export class VeiculosComponent implements OnInit {

  veiculoForm! : UntypedFormGroup
  veiculoId : any
  veiculoLoading : boolean = false
  submitted = false;
  rota : string = ''

  titulo : any
  mensagem : any
  msgErro : boolean = false

  editaVeiculo : boolean = false
  visualizaVeiculo : boolean = false
  loading : boolean = false

  constructor(private router : Router, private formBuider : UntypedFormBuilder, 
    private veiculoService : VeiculoService,  private activatedRoute: ActivatedRoute,
    ){
  }

  ngOnInit(): void {
    this.veiculoForm = this.formBuider.group({
      identificacao : new UntypedFormControl('', [Validators.required]),
      descricao : new UntypedFormControl('', [Validators.required]),
    })
    this.veiculoId = this.activatedRoute.snapshot.paramMap.get("id")
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.visualizaVeiculo = false
      this.editaVeiculo = false
    }
  }

  editar(){
    this.loading = true
    this.editaVeiculo = true
    this.veiculoService.findVeiculoByIdentificacao(this.veiculoId).subscribe((veiculo : any)=>{
      this.veiculoForm = this.formBuider.group({
        identificacao : veiculo.identificacao,
        descricao : veiculo.descricao
      })
      this.loading = false
    })
  }

  visualizar(){
    this.loading = true
    this.visualizaVeiculo = true
    this.veiculoService.findVeiculoByIdentificacao(this.veiculoId).subscribe((veiculo : any)=>{
      this.veiculoForm = this.formBuider.group({
        identificacao : veiculo.identificacao,
        descricao : veiculo.descricao
      })
      this.loading = false
    })
  }

  voltar(){
    this.router.navigate(['veiculos'])
  }

  async cadastrarVeiculo(){
    this.submitted = true
    await this.validaCampos()
    if(this.veiculoForm.valid){
      this.loading = true
      const formJson : any = {
        identificacao : this.veiculoForm.get('identificacao')?.value,
        descricao : this.veiculoForm.get('descricao')?.value,
      }

      console.log(formJson)
      this.veiculoService.post(formJson).subscribe(()=>{
        if(this.veiculoId == 'novo'){
          //this.exibirToast()
        }else{
          //this.exibirToast()
        }
        this.veiculoForm.reset()
        this.voltar()
        this.loading = false
      },()=>{
      })
    }
  }

  async validaVeiculo(){
    const veiculo = this.veiculoForm.get('identificacao')?.value
    this.veiculoService.findVeiculoByIdentificacao(veiculo).subscribe((dados : any)=>{
      console.log("Veículo encontrado: "+dados)
      if(dados != null && veiculo != ''){
        this.veiculoForm.controls['identificacao'].setErrors({'incorrect': true });
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe um veículo cadastrado com essa identificação" 
      }
    })
  }

  async validaCampos() {
    (<any>Object).values(this.veiculoForm.controls).forEach((control: any) => {
      control.markAsTouched();
      this.validaVeiculo()
    });
  }

}