import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-excluir',
  standalone: true,
  imports: [],
  templateUrl: './btn-excluir.component.html',
  styleUrl: './btn-excluir.component.scss'
})
export class BtnExcluirComponent {
  @Input() mostrarModal : any
}
