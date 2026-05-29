import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Joueur } from '../models/joueur.model';
import { Statjoueur } from '../models/statjoueur.model';
import { JoueurService } from '../services/joueur.service';
import { StatistiqueService } from '../services/statistique.service';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  joueurs: Joueur[] = [];
  toutesStats: Statjoueur[] = [];

  constructor(
    private joueurService: JoueurService,
    private statistiqueService: StatistiqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.joueurService.getJoueurs().subscribe({
      next: (joueurs) => {
        this.joueurs = joueurs;
        this.statistiqueService.getAllStats().subscribe({
          next: (stats) => {
            this.toutesStats = stats;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  getStat(id_joueur: number, id_statistique: number): number {
    const stat = this.toutesStats.find(s =>
      Number(s.id_joueur) === Number(id_joueur) &&
      Number(s.id_statistique) === Number(id_statistique)
    );
    return stat ? stat.notes : 0;
  }

  getTop5(id_statistique: number): { joueur: Joueur, valeur: number }[] {
    return this.joueurs
      .map(j => ({ joueur: j, valeur: this.getStat(Number(j.id), Number(id_statistique)) }))
      .sort((a, b) => b.valeur - a.valeur)
      .slice(0, 5);
  }

  getTop5Combine(id_stat1: number, id_stat2: number): { joueur: Joueur, valeur: number }[] {
    return this.joueurs
      .map(j => ({ joueur: j, valeur: this.getStat(Number(j.id), Number(id_stat1)) + this.getStat(Number(j.id), Number(id_stat2)) }))
      .sort((a, b) => b.valeur - a.valeur)
      .slice(0, 5);
  }
}