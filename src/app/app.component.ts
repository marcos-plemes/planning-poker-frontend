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
import { Carta } from './componentes/cartas/carta.interface';
import { RedmineService } from './componentes/redmine/redmine.service';

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

  jogoIniciado = true;

  resultadoAnterior: string = '';

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

  constructor(
    public readonly SocketService: SocketService,
    public readonly redmineService: RedmineService,
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
    this.SocketService.on("jogoIniciado", (jogoIniciado: boolean) => {
      console.log(jogoIniciado);
      this.jogoIniciado = jogoIniciado;
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
      this.resultadoAnterior = '';
      this.jogadores.forEach(jogador => {
        const index = jogadoresComCartas.findIndex(jogadorComCartas => jogadorComCartas.id === jogador.id);
        if (index !== -1) {
          jogador.tituloDaCarta = jogadoresComCartas[index].tituloDaCarta;
        }
        this.jogoIniciado = false;
        this.resultadoAnterior = this.resultadoAnterior + jogador.nome + ': ' + jogador.tituloDaCarta + '\n';
      });
      navigator.clipboard.writeText(this.resultadoAnterior).then();
    });
    this.SocketService.on("reiniciar-jogo", () => {
      this.jogoIniciado = true;
      this.cartas.forEach(carta => {
        carta.selecionada = false;
      });
      this.jogadores.forEach(jogador => {
        jogador.isCartaSelecionada = false;
        jogador.tituloDaCarta = '';
      });
    });

    this.redmineService.listaDeTarefasEmValidacao().subscribe(
      response => {
        console.log(response);
      }
    );

  }

  ngOnDestroy() {
    this.SocketService.disconnect();
  }

}
