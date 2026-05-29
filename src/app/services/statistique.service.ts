import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Statistique } from '../models/statistique.model';
import { Statjoueur } from '../models/statjoueur.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  //private apiUrl = 'https://localhost:7051';
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getStatistiques() {
    return this.http.get<Statistique[]>(`${this.apiUrl}/Statistique/Search`);
  }

  getStatsByJoueur(id_joueur: number) {
    return this.http.get<Statjoueur[]>(`${this.apiUrl}/Statjoueur/Search?id_joueur=${id_joueur}`);
  }

  getAllStats() {
  return this.http.get<Statjoueur[]>(`${this.apiUrl}/Statjoueur/Search`);
  }

  addStatJoueur(stat: Statjoueur) {
  return this.http.put(`${this.apiUrl}/Statjoueur/Add`, stat);
}

updateStatJoueur(stat: Statjoueur) {
  return this.http.post(`${this.apiUrl}/Statjoueur/Update`, stat);
}

}