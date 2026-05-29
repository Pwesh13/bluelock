import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  id_aspnetusers: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = environment.apiURL + '/Utilisateur';

  constructor(private http: HttpClient) {}

  getByAspnetusersId(id_aspnetusers: string) {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/Search?id_aspnetusers=${id_aspnetusers}`);
  }

  getById(id: number) {
  return this.http.get<Utilisateur>(`${this.apiUrl}/Single?id=${id}`);
  }
}