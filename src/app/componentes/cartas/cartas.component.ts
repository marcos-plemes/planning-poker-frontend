import { Component, Input } from '@angular/core';
import { Carta } from './carta.interface';
import { NgClass, NgForOf } from '@angular/common';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-cartas',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './cartas.component.html',
  styleUrl: './cartas.component.css'
})
export class CartasComponent {
  @Input() socket: SocketService | undefined;

  cartas: Carta[] = [
    { titulo: '2h', selecionada: false },
    { titulo: '4h', selecionada: false },
    { titulo: '1d', selecionada: false },
    { titulo: '2d', selecionada: false },
    { titulo: '3d', selecionada: false },
    { titulo: '4d', selecionada: false },
    { titulo: '1s', selecionada: false },
    { titulo: '+1s', selecionada: false }
  ];

  constructor() {
  }

  selecionarCarta(carta: Carta) {
    for (const element of this.cartas) {
      if (element.titulo !== carta.titulo) {
        element.selecionada = false;
      }
    }
    carta.selecionada = !carta.selecionada;
    if (this.socket) {
      this.socket.emit('tituloDaCarta', this.cartas.find(carta => carta.selecionada)?.titulo ?? '');
    }
  }

}
