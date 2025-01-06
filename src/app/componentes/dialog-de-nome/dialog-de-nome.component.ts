import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-dialog-de-nome',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatInput,
    FormsModule,
    MatFormField,
    MatFormFieldModule
  ],
  templateUrl: './dialog-de-nome.component.html',
  styleUrl: './dialog-de-nome.component.css'
})
export class DialogDeNomeComponent {

  usuario: string = '';

  senha: string = '';

  constructor(private dialogRef: MatDialogRef<DialogDeNomeComponent>) {
  }

  onClose(): void {
    this.dialogRef.close({
      usuario: this.usuario,
      senha: this.senha
    });
  }
}
