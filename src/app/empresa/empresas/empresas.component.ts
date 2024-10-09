import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { EmpresaService } from '../empresa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent,
    LoadingComponent,
  ],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit{

  empresaForm! : UntypedFormGroup
  empresaCodigo : any
  submitted = false;
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editaEmpresa : boolean = false
  visualizaEmpresa : boolean = false
  loading : boolean = false

  constructor(private router : Router, private formBuider : UntypedFormBuilder, 
    private empresaService : EmpresaService,  private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.empresaForm = this.formBuider.group({
      codigo : new UntypedFormControl('', [Validators.required]),
      descricao : new UntypedFormControl('', [Validators.required]),
      latitude : new UntypedFormControl('', [Validators.required]),
      longitude : new UntypedFormControl('', [Validators.required]),
      raio : new UntypedFormControl('', [Validators.required]),
    })
    this.empresaCodigo = this.activatedRoute.snapshot.paramMap.get("codigo")
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.visualizaEmpresa = false
      this.editaEmpresa = false
    }
  }

  editar(){
    this.editaEmpresa = true
    this.loading = true
    this.empresaService.findEmpresaByCodigo(this.empresaCodigo).subscribe((empresa : any)=>{
      console.log(empresa)
      this.empresaForm = this.formBuider.group({
        codigo : empresa.codigo,
        descricao : empresa.descricao,
        latitude : empresa.latitude,
        longitude : empresa.longitude,
        raio : empresa.raio,
      })
      this.loading = false
    })
  }

  visualizar(){
    this.visualizaEmpresa = true
    this.loading = true
    this.empresaService.findEmpresaByCodigo(this.empresaCodigo).subscribe((empresa : any)=>{
      this.empresaForm = this.formBuider.group({
        codigo : empresa.codigo,
        descricao : empresa.descricao,
        latitude : empresa.latitude,
        longitude : empresa.longitude,
        raio : empresa.raio,
        dataVinculo : empresa.dataVinculo,
      })
      this.loading = false
    })
  }

  async cadastrarEmpresa(){
    this.submitted = true
    await this.validaCampos()
    console.log("this.empresaForm.valid = "+this.empresaForm.valid)
    if(this.empresaForm.valid){
      this.loading = true
      const formJson : any = {
        codigo : this.empresaForm.get('codigo')?.value,
        descricao : this.empresaForm.get('descricao')?.value,
        latitude : this.empresaForm.get('latitude')?.value,
        longitude : this.empresaForm.get('longitude')?.value,
        raio : this.empresaForm.get('raio')?.value,
      }

      console.log(formJson)
      this.empresaService.postEmpresa(formJson).subscribe(()=>{
        this.empresaForm.reset()
        this.loading = false
        this.voltar()
      },()=>{
        this.loading = false
      })
    }
  }

  async validaCampos() {
    (<any>Object).values(this.empresaForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  async validaCodigoEmpresa(){
    const codigo = this.empresaForm.get('codigo')?.value
    console.log("codigo: "+codigo)
    this.empresaService.findEmpresaByCodigo(codigo).subscribe((dados : any)=>{
      console.log("dados: ")
      console.log(dados)
      if(dados != null && codigo != ''){
        this.msgErro = true
        this.titulo = "Atenção!"
        this.mensagem = "Já existe uma empresa cadastrada com esse código"
        this.empresaForm.controls['codigo'].setErrors({'incorrect': true });
        this.empresaForm.controls['codigo'].markAsTouched()
      }
      else
        this.empresaForm.controls['codigo'].setErrors(null);
    })
  }

  voltar(){
    this.router.navigate(['empresas'])
  }

}
