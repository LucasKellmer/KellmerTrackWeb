import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { DispositivosComponent } from '../dispositivo/dispositivos/dispositivos.component';
import { DispositivosListComponent } from '../dispositivo/dispositivos-list/dispositivos-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    MenuComponent,
    DispositivosComponent,
    DispositivosListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kellmertrackweb';
}
