import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartasComponent } from './componentes/cartas/cartas.component';
import { JogadorComponent } from './componentes/jogador/jogador.component';
import { MesaComponent } from './componentes/mesa/mesa.component';
import { SocketService } from './socket.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeNomeComponent } from './componentes/dialog-de-nome/dialog-de-nome.component';
import Jogador from './jogador';
import { CommonModule, NgForOf } from '@angular/common';
import { Carta } from './componentes/cartas/carta.interface';
import { RedmineService } from './componentes/redmine/redmine.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CartasComponent,
    JogadorComponent,
    MesaComponent,
    NgForOf,
    MatProgressSpinner,
    CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  jogadores: Jogador[] = [];

  nomeDoJogador: string | null = '';

  jogoIniciado = true;

  resultadoAnterior: string[] = [];

  servidorLigado = false;

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
    private readonly redmineService: RedmineService,
    private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.SocketService.on('connect', () => {
      console.log('Conectado ao servidor');
      this.servidorLigado = true;
      this.buscarNomeDoJogador();
    });

    this.SocketService.on('disconnect', () => {
      console.log('Desconectado do servidor');
      this.servidorLigado = false;
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
      this.resultadoAnterior = [];
      this.jogadores.forEach(jogador => {
        const index = jogadoresComCartas.findIndex(jogadorComCartas => jogadorComCartas.id === jogador.id);
        if (index !== -1) {
          jogador.tituloDaCarta = jogadoresComCartas[index].tituloDaCarta;
        }
        this.jogoIniciado = false;
        this.resultadoAnterior.push(jogador.nome + ': ' + jogador.tituloDaCarta);
      });
      this.resultadoAnterior.sort((a, b) => a.localeCompare(b));
      navigator.clipboard.writeText(this.resultadoAnterior.join('\n')).then();
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

  }

  ngOnDestroy() {
    this.SocketService.disconnect();
  }

  buscarNomeDoJogador() {
    this.nomeDoJogador = localStorage.getItem('nomeDoJogador');

    if (this.nomeDoJogador) {
      this.SocketService.emit('nomeDoJogador', this.nomeDoJogador);

    } else {
      this.logarNoRedmine();
    }
  }

  logarNoRedmine() {
    this.dialog.open(DialogDeNomeComponent, {
      width: '450px',
      disableClose: true
    }).afterClosed().subscribe(result => {
      this.redmineService.buscarNomeDoUsuario(result.usuario, result.senha).subscribe(nomeDoUsuario => {
        localStorage.setItem('nomeDoJogador', nomeDoUsuario);
        this.nomeDoJogador = nomeDoUsuario;
        this.SocketService.emit('nomeDoJogador', nomeDoUsuario);
      }, () => {
        alert('Usuário ou senha inválidos');
        this.logarNoRedmine();
      });
    });
  }

}
