import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Joueur } from '../models/joueur.model';
import { Poste } from '../models/poste.model';
import { Statjoueur } from '../models/statjoueur.model';
import { JoueurService } from '../services/joueur.service';
import { PosteService } from '../services/poste.service';
import { StatistiqueService } from '../services/statistique.service';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit {
  joueurs: Joueur[] = [];
  joueursFiltres: Joueur[] = [];
  postes: Poste[] = [];
  toutesStats: Statjoueur[] = [];

  filtrePoste: number = 0;
  filtreNationalite: string = '';
  nationalites: string[] = [];

  constructor(
    private joueurService: JoueurService,
    private posteService: PosteService,
    private statistiqueService: StatistiqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.posteService.getPostes().subscribe({
      next: (postes) => {
        this.postes = postes;
        this.joueurService.getJoueurs().subscribe({
          next: (joueurs) => {
            this.joueurs = joueurs;
            this.joueursFiltres = joueurs;
            this.nationalites = [...new Set(joueurs.map(j => j.nationality))];
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erreur joueurs:', err)
        });
      },
      error: (err) => console.error('Erreur postes:', err)
    });

    this.statistiqueService.getAllStats().subscribe({
      next: (stats) => {
        this.toutesStats = stats;
        this.cdr.detectChanges();
      } 
    });
  }

  getNomPoste(id_poste: number): string {
    const poste = this.postes.find(p => p.id === id_poste);
    return poste ? poste.nomPoste : 'Inconnu';
  }

  getStat(id_joueur: number, id_statistique: number): number {
    const stat = this.toutesStats.find(s => s.id_joueur === id_joueur && s.id_statistique === id_statistique);
    return stat ? stat.notes : 0;
  }

  appliquerFiltres(): void {
    this.joueursFiltres = this.joueurs.filter(j => {
      const matchPoste = this.filtrePoste == 0 || j.id_poste == this.filtrePoste;
      const matchNationalite = this.filtreNationalite === '' || j.nationality === this.filtreNationalite;
      return matchPoste && matchNationalite;
    });
  }

  resetFiltres(): void {
    this.filtrePoste = 0;
    this.filtreNationalite = '';
    this.joueursFiltres = this.joueurs;
  }
}