import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './Tarefa';

@Injectable({
  providedIn: 'root'
})
export class RedmineService {

  private baseUrl = 'https://planning-poker-backend-el5z.onrender.com';

  constructor(private readonly http: HttpClient) {
  }

  listaDeTarefasEmValidacao(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.baseUrl}/tarefas-para-validacao`);
  }

}
