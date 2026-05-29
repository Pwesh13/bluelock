import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Statinterne } from '../models/statinterne.model';
import { Statintjoueur } from '../models/statintjoueur.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatinterneService {
  private apiUrl = environment.apiURL;
  // private apiUrl = 'https://localhost:7051';


  constructor(private http: HttpClient) {}

  getStatinternes() {
    return this.http.get<Statinterne[]>(`${this.apiUrl}/Statinterne/Search`);
  }

  getStatinternesByJoueur(id_joueur: number) {
    return this.http.get<Statintjoueur[]>(`${this.apiUrl}/Statintjoueur/Search?id_joueur=${id_joueur}`);
  }
  
  addStatIntjoueur(stat: Statintjoueur) {
  return this.http.put(`${this.apiUrl}/Statintjoueur/Add`, stat);
}

updateStatIntjoueur(stat: Statintjoueur) {
  return this.http.post(`${this.apiUrl}/Statintjoueur/Update`, stat);
}
}