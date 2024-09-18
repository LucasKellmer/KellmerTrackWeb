import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { MsgModalComponent } from '../../shared/msg-modal/msg-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PesquisaService } from '../../pesquisa.service';
import { EntregasService } from '../entregas.service';

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [
    NgIf, NgFor, 
    ReactiveFormsModule , 
    HeaderComponent,
    CommonModule,
    MsgModalComponent
  ],
  templateUrl: './entregas.component.html',
  styleUrl: './entregas.component.scss'
})
export class EntregasComponent {

  entregaForm! : UntypedFormGroup
  entregaId : any
  entregaNextId : any
  contratos : any
  contratosLoading : boolean = false
  veiculos : any
  veiculosLoading : boolean = false
  submitted = false;
  titulo : any
  mensagem : any
  msgErro : boolean = false
  rota : string = ''

  editaEntrega : boolean = false
  visualizaEntrega : boolean = false
  loading : boolean = false

  constructor(private service : PesquisaService, private router : Router, private formBuider : UntypedFormBuilder, 
    private entregaService : EntregasService,  private activatedRoute: ActivatedRoute){}

    ngOnInit(): void {
      this.entregaForm = this.formBuider.group({
        id : new UntypedFormControl(''),
        momento : new UntypedFormControl(''),
        veiculo : new UntypedFormControl('', [Validators.required]),
        contrato : new UntypedFormControl('', [Validators.required]),
        quantidade : new UntypedFormControl('', [Validators.required]),
        status : new UntypedFormControl(''),
        })
      this.entregaId = this.activatedRoute.snapshot.paramMap.get("id")
      this.rota = this.router.url
  
      if(!this.rota.match('novo')) {
        if(this.rota.match('editar')){
          this.editar()
        }else{
          this.visualizar()
        }
      }else{
        this.entregaService.nextId().subscribe((dados : any)=>{
          this.entregaNextId = dados
        })
        this.buscaContrato()
        this.buscaVeiculos()
        this.visualizaEntrega = false
        this.editaEntrega = false
      }
    }
  
    buscaContrato(){
      this.contratosLoading = true
      this.service.consultar('contratos').subscribe((dados : any)=>{
        this.contratos = dados
        this.contratosLoading = false
      })
    }

    buscaVeiculos(){
      this.veiculosLoading = true
      this.service.consultar('veiculos').subscribe((dados: any)=>{
        this.veiculos = dados
        this.veiculosLoading = false
      })
    }
  
    editar(){
      this.editaEntrega = true
      this.entregaService.findEntregaById(this.entregaId).subscribe((entrega : any)=>{
        console.log(entrega)
        this.entregaForm = this.formBuider.group({
          id : entrega.id,
          veiculo : entrega.veiculo,
          contrato : entrega.contrato.numero,
          quantidade : entrega.quantidade,
          status : entrega.status
        })
        this.buscaContrato()
        this.buscaVeiculos()
        this.desabilitaCombobox()
      })
    }
  
    visualizar(){
      this.visualizaEntrega = true
      this.entregaService.findEntregaById(this.entregaId).subscribe((entrega : any)=>{
        this.entregaForm = this.formBuider.group({
          id : entrega.id,
          veiculo : entrega.veiculo,
          contrato : entrega.contrato.contrato.id,
          quantidade : entrega.quantidade,
          status : entrega.status
        })
        this.buscaContrato()
        this.buscaVeiculos()
        this.desabilitaCombobox()
      })
    }
  
    desabilitaCombobox(){
      if(this.visualizaEntrega){
        this.entregaForm.get('contrato')?.disable();
        this.entregaForm.get('veiculo')?.disable();
      }
      this.entregaForm.get('status')?.disable();
    }
  
    voltar(){
      this.router.navigate(['entregas'])
    }

    async cadastrarEntrega(){
      this.submitted = true
      await this.validaCampos()
      if(this.entregaForm.valid){
        const formJson : any = {
          id : this.entregaForm.get('id')?.value,
          momento : new Date,
          veiculo : this.entregaForm.get('veiculo')?.value,
          contrato : this.entregaForm.get('contrato')?.value,
          quantidade : this.entregaForm.get('quantidade')?.value
        }
  
        console.log(formJson)
        this.entregaService.postEntrega(formJson).subscribe(()=>{
          if(this.entregaId == 'novo'){
            
          }else{
            
          }
          this.entregaForm.reset()
          this.voltar()
        },()=>{
        })
      }
    }
    async validaCampos() {
      (<any>Object).values(this.entregaForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
  
}
