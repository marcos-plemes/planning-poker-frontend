import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartasComponent } from './componentes/cartas/cartas.component';
import { JogadorComponent } from './componentes/jogador/jogador.component';
import { MesaComponent } from './componentes/mesa/mesa.component';
import { SocketService } from './socket.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeNomeComponent } from './componentes/dialog-de-nome/dialog-de-nome.component';
import Jogador from './jogador';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartasComponent, JogadorComponent, MesaComponent, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  jogadores: Jogador[] = [];

  nomeDoJogador: string = '';

  constructor(
    public readonly SocketService: SocketService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.SocketService.on('connect', () => {
      console.log('Conectado ao servidor');
      this.dialog.open(DialogDeNomeComponent, {
        width: '350px',
        disableClose: true
      }).afterClosed().subscribe(result => {
        this.nomeDoJogador = result;
        this.SocketService.emit('nomeDoJogador', result);
      });
    });
    this.SocketService.on('disconnect', () => {
      console.log('Desconectado do servidor');
    });
    this.SocketService.on("jogadoresConectados", (jogadoresConectados: Jogador[]) => {
      this.jogadores = this.jogadores.concat(jogadoresConectados);
      console.log(this.jogadores);
    });
    this.SocketService.on("jogadorConectado", (jogadorConectado: Jogador) => {
      this.jogadores.push(jogadorConectado);
    });
    this.SocketService.on("jogadorDesconectado", (jogadorDesconectado: Jogador) => {
      this.jogadores = this.jogadores.filter(jogador => jogador.id !== jogadorDesconectado.id);
    });
    this.SocketService.on("jogadorEscolheuUmaCarta", (jogadorEscolheuUmaCarta: Jogador) => {
      const index = this.jogadores.findIndex(jogador => jogador.id === jogadorEscolheuUmaCarta.id);
      this.jogadores[index].isCartaSelecionada = jogadorEscolheuUmaCarta.isCartaSelecionada;
    });
    this.SocketService.on("cartas-escolhidas", (jogadoresComCartas: Jogador[]) => {
      this.jogadores.forEach(jogador => {
        const index = jogadoresComCartas.findIndex(jogadorComCartas => jogadorComCartas.id === jogador.id);
        jogador.tituloDaCarta = jogadoresComCartas[index].tituloDaCarta;
      });
    });
    this.SocketService.on("reiniciar-jogo", () => {
      this.jogadores.forEach(jogador => {
        jogador.isCartaSelecionada = false;
        jogador.tituloDaCarta = '';
      });
    });

  }

  ngOnDestroy() {
    this.SocketService.disconnect();
  }

}
