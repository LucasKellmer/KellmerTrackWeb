import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-msg-modal',
  standalone: true,
  imports: [],
  templateUrl: './msg-modal.component.html',
  styleUrl: './msg-modal.component.scss'
})
export class MsgModalComponent {

  @Input() titulo : any
  @Input() mensagem : any

}
