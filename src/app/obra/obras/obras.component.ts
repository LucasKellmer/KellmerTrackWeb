import { Component, OnInit } from '@angular/core';
import { ObraService } from '../obra.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent,
    LoadingComponent,
  ],
  templateUrl: './obras.component.html',
  styleUrl: './obras.component.scss'
})
export class ObrasComponent  implements OnInit{

  obraForm! : UntypedFormGroup
  obraId : any
  submitted = false;
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editarObra : boolean = false
  visualizarObra : boolean = false
  loading : boolean = false

  constructor(private router : Router, private formBuider : UntypedFormBuilder, 
    private obraService : ObraService,  private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.obraForm = this.formBuider.group({
      id : new UntypedFormControl(''),
      descricao : new UntypedFormControl('', [Validators.required]),
      cidade : new UntypedFormControl('', [Validators.required]),
      bairro : new UntypedFormControl('', [Validators.required]),
      numero : new UntypedFormControl('', [Validators.required]),
      complemento : new UntypedFormControl(''),
      latitude : new UntypedFormControl('', [Validators.required]),
      longitude : new UntypedFormControl('', [Validators.required]),
      raio : new UntypedFormControl('', [Validators.required]),
    })
    this.obraId = this.activatedRoute.snapshot.paramMap.get("id")
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.visualizarObra = false
      this.editarObra = false
    }
  }

  editar(){
    this.editarObra = true
    this.loading = true
    this.obraService.findObraById(this.obraId).subscribe((obra : any)=>{
      console.log(obra)
      this.obraForm = this.formBuider.group({
        id : obra.id,
        descricao : obra.descricao,
        cidade : obra.cidade,
        bairro : obra.bairro,
        numero : obra.numero,
        complemento : obra.complemento,
        latitude : obra.latitude,
        longitude : obra.longitude,
        raio : obra.raio,
      })
      this.loading = false
    })
  }

  visualizar(){
    this.visualizarObra = true
    this.loading = true
    this.obraService.findObraById(this.obraId).subscribe((obra : any)=>{
      this.obraForm = this.formBuider.group({
        id : obra.id,
        descricao : obra.descricao,
        cidade : obra.cidade,
        bairro : obra.bairro,
        numero : obra.numero,
        complemento : obra.complemento,
        latitude : obra.latitude,
        longitude : obra.longitude,
        raio : obra.raio,
        dataVinculo : obra.dataVinculo,
      })
      this.loading = false
    })
  }

  async cadastrarObra(){
    this.submitted = true
    this.loading = true
    await this.validaCampos()
    console.log("this.obraForm.valid = "+this.obraForm.valid)
    if(this.obraForm.valid){
      const formJson : any = {
        id : this.obraForm.get('id')?.value,
        descricao : this.obraForm.get('descricao')?.value,
        cidade : this.obraForm.get('cidade')?.value,
        bairro : this.obraForm.get('bairro')?.value,
        numero : this.obraForm.get('numero')?.value,
        complemento : this.obraForm.get('complemento')?.value,
        latitude : this.obraForm.get('latitude')?.value,
        longitude : this.obraForm.get('longitude')?.value,
        raio : this.obraForm.get('raio')?.value,
      }
      console.log(formJson)
      this.obraService.postObra(formJson).subscribe(()=>{
        this.obraForm.reset()
        this.loading = false
        this.voltar()
      },()=>{
      })
    }
  }

  async validaCampos() {
    (<any>Object).values(this.obraForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  voltar(){
    this.router.navigate(['obras'])
  }
}
