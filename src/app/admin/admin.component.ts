import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Joueur } from '../models/joueur.model';
import { Poste } from '../models/poste.model';
import { JoueurService } from '../services/joueur.service';
import { PosteService } from '../services/poste.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  joueurs: Joueur[] = [];
  postes: Poste[] = [];
  confirmation: number | null = null;

  constructor(
    private joueurService: JoueurService,
    private posteService: PosteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.posteService.getPostes().subscribe({
      next: (postes) => {
        this.postes = postes;
        this.joueurService.getJoueurs().subscribe({
          next: (joueurs) => {
            this.joueurs = joueurs;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  getNomPoste(id_poste: number): string {
    const poste = this.postes.find(p => p.id === id_poste);
    return poste ? poste.nomPoste : '?';
  }

  confirmerSuppression(id: number) {
    this.confirmation = id;
  }

  annulerSuppression() {
    this.confirmation = null;
  }

  supprimerJoueur(joueur: Joueur) {
    this.joueurService.deleteJoueur(joueur).subscribe({
      next: () => {
        this.joueurs = this.joueurs.filter(j => j.id !== joueur.id);
        this.confirmation = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur suppression:', err)
    });
  }
}