import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-de-nome',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatInput,
    FormsModule,
    MatFormField
  ],
  templateUrl: './dialog-de-nome.component.html',
  styleUrl: './dialog-de-nome.component.css'
})
export class DialogDeNomeComponent {

  nomeDoJogador: string = '';

  constructor(private dialogRef: MatDialogRef<DialogDeNomeComponent>) {
  }

  onClose(): void {
    this.dialogRef.close(this.nomeDoJogador);
  }
}
