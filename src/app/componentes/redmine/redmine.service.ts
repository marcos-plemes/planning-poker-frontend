import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedmineService {

  private baseUrl = 'https://planning-poker-backend-el5z.onrender.com';

  // private baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {
  }

  buscarNomeDoUsuario(usuario: string, senha: string): Observable<string> {
    const encodedCredentials = btoa(`${usuario}:${senha}`);
    return this.http.get<string>(`${this.baseUrl}/buscar-nome-do-usuario`, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    });
  }

}
