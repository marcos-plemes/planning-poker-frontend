import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartasComponent } from './componentes/cartas/cartas.component';
import { JogadorComponent } from './componentes/jogador/jogador.component';
import { MesaComponent } from './componentes/mesa/mesa.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartasComponent, JogadorComponent, MesaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'planning-poker';
}
