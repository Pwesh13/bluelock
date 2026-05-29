import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Joueur } from '../models/joueur.model';
import { Statistique } from '../models/statistique.model';
import { Statjoueur } from '../models/statjoueur.model';
import { Poste } from '../models/poste.model';
import { JoueurService } from '../services/joueur.service';
import { PosteService } from '../services/poste.service';
import { StatistiqueService } from '../services/statistique.service';

@Component({
  selector: 'app-joueur-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './joueur-detail.component.html',
  styleUrl: './joueur-detail.component.css',
})
export class JoueurDetailComponent implements OnInit {
  joueur: Joueur | null = null;
  nomPoste: string = '';
  statistiques: Statistique[] = [];
  statsjoueur: Statjoueur[] = [];

  constructor(
    private route: ActivatedRoute,
    private joueurService: JoueurService,
    private posteService: PosteService,
    private statistiqueService: StatistiqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.joueurService.getJoueurById(id).subscribe({
      next: (joueur) => {
        this.joueur = joueur;
        this.cdr.detectChanges();
        this.posteService.getPostes().subscribe({
          next: (postes) => {
            const poste = postes.find(p => p.id === joueur.id_poste);
            this.nomPoste = poste ? poste.nomPoste : 'Inconnu';
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => console.error('Erreur joueur:', err)
    });

    this.statistiqueService.getStatistiques().subscribe({
      next: (stats) => {
        this.statistiques = stats;
        this.cdr.detectChanges();
      }
    });

    this.statistiqueService.getStatsByJoueur(id).subscribe({
      next: (stats) => {
        this.statsjoueur = stats;
        this.cdr.detectChanges();
      }
    });
  }

  getValeurStat(id_statistique: number): number {
    const stat = this.statsjoueur.find(s => s.id_statistique === id_statistique);
    return stat ? stat.notes : 0;
  }
}