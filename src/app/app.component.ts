import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartasComponent } from './componentes/cartas/cartas.component';
import { JogadorComponent } from './componentes/jogador/jogador.component';
import { MesaComponent } from './componentes/mesa/mesa.component';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartasComponent, JogadorComponent, MesaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private SocketService: SocketService) {
    this.SocketService.on('connect', () => {
      console.log('Conectado ao servidor');
    });
    this.SocketService.on('disconnect', () => {
      console.log('Desconectado do servidor');
    });
    this.SocketService.on("jogadoresConectados", (jogadores: any) => {
      console.log(jogadores);
    });

  }

}
