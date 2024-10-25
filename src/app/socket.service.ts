import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Substitua pela URL do seu servidor
  }

  // Emitir um evento
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Ouvir um evento
  on(eventName: string, callback: (data: any) => void) {
    this.socket.on(eventName, callback);
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
