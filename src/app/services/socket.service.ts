import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  messageSubject = new Subject<any>();

  constructor() {}

  public connect(): void {
    console.log("tentando se conectar ao socket:")
    if (this.socket) {
      this.disconnect();
    }

    const user = localStorage.getItem('user') || '0000';
    const socketUrl = `${environment.socket}?user=${user}`;

    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log("Tentando estabelecer conexão: ")
      this.handleOpen();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      this.handleClose();
    };

    this.socket.onerror = (error: Event) => {
      this.handleError(error);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Normal Closure');
    }
    this.socket = null;
  }

  public sendMessage(data: any): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not open');
    }
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  public getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  private handleOpen(): void {
    this.connectionStatus.next(true);
    //this.registerClient();
  }

  private handleMessage(data: any): void {
    try {
      //const parsedData = JSON.parse(data);
      this.messageSubject.next(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', data, error);
    }
  }

  private handleClose(): void {
    this.connectionStatus.next(false);
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.connectionStatus.next(false);
  }

  /*private registerClient(): void {
    this.sendMessage({ type: 'TESTE', message: "teste" });
  }*/
}