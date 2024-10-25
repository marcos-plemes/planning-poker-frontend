import { Component, Input } from '@angular/core';
import Jogador from '../../jogador';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-jogador',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './jogador.component.html',
  styleUrl: './jogador.component.css'
})
export class JogadorComponent {

  @Input() jogador: Jogador | undefined;

}
