import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poste } from '../models/poste.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PosteService {
  //private apiUrl = 'https://localhost:7051/Poste';
  private apiUrl = environment.apiURL + '/Poste';

  constructor(private http: HttpClient) {}

  getPostes() {
    return this.http.get<Poste[]>(`${this.apiUrl}/Search`);
  }
}