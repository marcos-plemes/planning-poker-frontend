import { Component, Input } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-mesa',
  standalone: true,
  imports: [],
  templateUrl: './mesa.component.html',
  styleUrl: './mesa.component.css'
})
export class MesaComponent {
  @Input() socket: SocketService | undefined;

  @Input() jogoIniciado = true;

  revelarCarta() {
    if (this.socket && this.jogoIniciado) {
      this.socket?.emit('revelar-cartas', {});
      this.jogoIniciado = false;
    } else if (this.socket && !this.jogoIniciado) {
      this.socket?.emit('reiniciar-jogo', {});
      this.jogoIniciado = true;
    }

  }

}
