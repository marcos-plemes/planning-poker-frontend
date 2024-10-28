import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './Tarefa';

@Injectable({
  providedIn: 'root'
})
export class RedmineService {

  private baseUrl = 'https://redmine.cloudmega.com.br/issues.json';

  constructor(private readonly http: HttpClient) {
  }

  listaDeTarefasEmValidacao(): Observable<Tarefa[]> {
    const params = new HttpParams()
      .set('cf_4', 'Recursos Humanos')
      .set('status_id', '54');

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`marcoslemes:Fr12ju90.#`)
    });

    return this.http.get<Tarefa[]>(this.baseUrl, { params, headers });
  }

}
