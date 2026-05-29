import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joueur } from '../models/joueur.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  //private apiUrl = 'https://localhost:7051/Joueur';
  private apiUrl = environment.apiURL + '/Joueur';

  constructor(private http: HttpClient) {}

  getJoueurs() {
    return this.http.get<Joueur[]>(`${this.apiUrl}/Search`);
  }

  getJoueurById(id: number) {
  return this.http.get<Joueur>(`${this.apiUrl}/Single?id=${id}`);
  }

  addJoueur(joueur: Joueur) {
    return this.http.put<Joueur>(`${this.apiUrl}/Add`, joueur);
  }

  updateJoueur(joueur: Joueur) {
    return this.http.post<Joueur>(`${this.apiUrl}/Update`, joueur);
  }

  deleteJoueur(joueur: Joueur) {
    return this.http.delete<Joueur>(`${this.apiUrl}/Delete`, { body: joueur });
  }
}

