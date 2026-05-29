import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Joueur } from '../models/joueur.model';
import { Poste } from '../models/poste.model';
import { Statistique } from '../models/statistique.model';
import { Statjoueur } from '../models/statjoueur.model';
import { Statinterne } from '../models/statinterne.model';
import { Statintjoueur } from '../models/statintjoueur.model';
import { AuthService } from '../services/auth.service';
import { JoueurService } from '../services/joueur.service';
import { PosteService } from '../services/poste.service';
import { StatistiqueService } from '../services/statistique.service';
import { StatinterneService } from '../services/statinterne.service';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-mon-profil',
  imports: [CommonModule, RouterModule],
  templateUrl: './mon-profil.component.html',
  styleUrl: './mon-profil.component.css',
})
export class MonProfilComponent implements OnInit {
  joueur: Joueur | null = null;
  nomPoste: string = '';
  statistiques: Statistique[] = [];
  statsjoueur: Statjoueur[] = [];
  statinternes: Statinterne[] = [];
  statintjoueur: Statintjoueur[] = [];
  pasDeJoueur: boolean = false;

  constructor(
    private authService: AuthService,
    private joueurService: JoueurService,
    private posteService: PosteService,
    private statistiqueService: StatistiqueService,
    private statinterneService: StatinterneService,
    private utilisateurService: UtilisateurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.utilisateurService.getByAspnetusersId(currentUser.id).subscribe({
      next: (utilisateurs) => {
        if (utilisateurs.length === 0) {
          this.pasDeJoueur = true;
          this.cdr.detectChanges();
          return;
        }

        const utilisateur = utilisateurs[0];

        this.joueurService.getJoueurs().subscribe({
          next: (joueurs) => {
            const joueurTrouve = joueurs.find(j => j.id_user === utilisateur.id);
            if (!joueurTrouve) {
              this.pasDeJoueur = true;
              this.cdr.detectChanges();
              return;
            }

            this.joueur = joueurTrouve;

            this.posteService.getPostes().subscribe({
              next: (postes) => {
                const poste = postes.find(p => p.id === joueurTrouve.id_poste);
                this.nomPoste = poste ? poste.nomPoste : 'Inconnu';
                this.cdr.detectChanges();
              }
            });

            this.statistiqueService.getStatistiques().subscribe({
              next: (stats) => this.statistiques = stats
            });

            this.statistiqueService.getStatsByJoueur(joueurTrouve.id).subscribe({
              next: (stats) => {
                this.statsjoueur = stats;
                this.cdr.detectChanges();
              }
            });

            this.statinterneService.getStatinternes().subscribe({
              next: (stats) => this.statinternes = stats
            });

            this.statinterneService.getStatinternesByJoueur(joueurTrouve.id).subscribe({
              next: (stats) => {
                this.statintjoueur = stats;
                this.cdr.detectChanges();
              }
            });
          }
        });
      }
    });
  }

  getValeurStat(id_statistique: number): number {
    const stat = this.statsjoueur.find(s => Number(s.id_statistique) === Number(id_statistique));
    return stat ? stat.notes : 0;
  }

  getValeurStatInterne(id_stat_interne: number): number {
    const stat = this.statintjoueur.find(s => Number(s.id_stat_interne) === Number(id_stat_interne));
    return stat ? stat.valeur : 0;
  }

  getPourcentage(valeur: number, max: number): number {
    return Math.round((valeur / max) * 100);
  }
}