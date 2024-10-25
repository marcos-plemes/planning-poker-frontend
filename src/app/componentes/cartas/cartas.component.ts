import { Component } from '@angular/core';
import { Carta } from './carta.interface';
import { NgClass, NgForOf } from '@angular/common';

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
  cartas: Carta[] = [
    { titulo: '2h', selecionada: true },
    { titulo: '4h', selecionada: false },
    { titulo: '1d', selecionada: false },
    { titulo: '2d', selecionada: false },
    { titulo: '3d', selecionada: false },
    { titulo: '4d', selecionada: false },
    { titulo: '1s', selecionada: false },
    { titulo: '+1s', selecionada: false }
  ];
}
