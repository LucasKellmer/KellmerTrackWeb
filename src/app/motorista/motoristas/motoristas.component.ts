import { Component, OnInit } from '@angular/core';
import { PesquisaService } from '../../pesquisa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MotoristaService } from '../motorista.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';

@Component({
  selector: 'app-motoristas',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule, 
    HeaderComponent,
    CommonModule,
  ],
  templateUrl: './motoristas.component.html',
  styleUrl: './motoristas.component.scss'
})
export class MotoristasComponent implements OnInit {

  motoristaForm! : UntypedFormGroup
  motoristaId : any
  motoristaNextId : any
  submitted = false;
  rota : string = ''

  msgErro : boolean = false

  editaMotorista : boolean = false
  visualizaMotorista : boolean = false
  loading : boolean = false

  constructor(private router : Router, private formBuider : UntypedFormBuilder, 
    private motoristaService : MotoristaService,  private activatedRoute: ActivatedRoute,
    ){
  }

  ngOnInit(): void {
    this.motoristaForm = this.formBuider.group({
      id : new UntypedFormControl(''),
      nome : new UntypedFormControl('', [Validators.required]),
    })
    this.motoristaId = this.activatedRoute.snapshot.paramMap.get("id")
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.motoristaService.nextId().subscribe((dados : any)=>{
        this.motoristaNextId = dados
      })
      this.visualizaMotorista = false
      this.editaMotorista = false
    }
  }

  editar(){
    this.editaMotorista = true
    this.motoristaService.findMotoristaById(this.motoristaId).subscribe((motorista : any)=>{
      this.motoristaForm = this.formBuider.group({
        id : motorista.id,
        nome : motorista.nome
      })
    })
  }

  visualizar(){
    this.visualizaMotorista = true
    this.motoristaService.findMotoristaById(this.motoristaId).subscribe((motorista : any)=>{
      this.motoristaForm = this.formBuider.group({
        id : motorista.id,
        nome : motorista.nome
      })
    })
  }

  voltar(){
    this.router.navigate(['motoristas'])
  }

  async cadastrarMotorista(){
    this.submitted = true
    await this.validaCampos()
    if(this.motoristaForm.valid){
      const formJson : any = {
        id : this.motoristaForm.get('id')?.value,
        nome : this.motoristaForm.get('nome')?.value,
      }

      console.log(formJson)
      this.motoristaService.post(formJson).subscribe(()=>{
        if(this.motoristaId == 'novo'){
          //this.exibirToast()
        }else{
          //this.exibirToast()
        }
        this.motoristaForm.reset()
        this.voltar()
      },()=>{
      })
    }
  }

  async validaCampos() {
    (<any>Object).values(this.motoristaForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

}
