import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../clientes.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent,
    LoadingComponent,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit{

  clienteForm! : UntypedFormGroup
  clienteId : any
  submitted = false;
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editarCliente : boolean = false
  visualizarCliente : boolean = false
  loading : boolean = false

  constructor(private router : Router, private formBuider : UntypedFormBuilder, 
    private clienteService : ClientesService,  private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.clienteForm = this.formBuider.group({
      id : new UntypedFormControl(''),
      nome : new UntypedFormControl('', [Validators.required]),
      cpf : new UntypedFormControl('', [Validators.required]),
      cnpj : new UntypedFormControl('', [Validators.required]),
      email : new UntypedFormControl('', [Validators.required]),
    })
    this.clienteId = this.activatedRoute.snapshot.paramMap.get("id")
    this.rota = this.router.url

    if(!this.rota.match('novo')) {
      if(this.rota.match('editar')){
        this.editar()
      }else{
        this.visualizar()
      }
    }else{
      this.visualizarCliente = false
      this.editarCliente = false
    }
  }

  editar(){
    this.editarCliente = true
    this.loading = true
    this.clienteService.findClienteById(this.clienteId).subscribe((cliente : any)=>{
      console.log(cliente)
      this.clienteForm = this.formBuider.group({
        id : cliente.id,
        nome : cliente.nome,
        cpf : cliente.cpf,
        cnpj : cliente.cnpj,
        email : cliente.email
      })
      this.loading = false
    })
  }

  visualizar(){
    this.visualizarCliente = true
    this.loading = true
    this.clienteService.findClienteById(this.clienteId).subscribe((cliente : any)=>{
      this.clienteForm = this.formBuider.group({
        id : cliente.id,
        nome : cliente.nome,
        cpf : cliente.cpf,
        cnpj : cliente.cnpj,
        email : cliente.email
      })
      this.loading = false
    })
  }

  async cadastrarCliente(){
    this.submitted = true
    await this.validaCampos()
    if(this.clienteForm.valid){
      this.loading = true
      const formJson : any = {
        id : this.clienteForm.get('id')?.value,
        nome : this.clienteForm.get('nome')?.value,
        cpf : this.clienteForm.get('cpf')?.value,
        cnpj : this.clienteForm.get('cnpj')?.value,
        email : this.clienteForm.get('email')?.value
      }

      console.log(formJson)
      this.clienteService.postCliente(formJson).subscribe(()=>{
        this.clienteForm.reset()
        this.voltar()
        this.loading = false
      },()=>{
        this.loading = false
      })
    }
  }

  async validaCampos() {
    (<any>Object).values(this.clienteForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  voltar(){
    this.router.navigate(['clientes'])
  }

}
