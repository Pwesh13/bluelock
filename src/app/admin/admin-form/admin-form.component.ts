import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Joueur } from '../../models/joueur.model';
import { Poste } from '../../models/poste.model';
import { Statistique } from '../../models/statistique.model';
import { Statjoueur } from '../../models/statjoueur.model';
import { Statinterne } from '../../models/statinterne.model';
import { Statintjoueur } from '../../models/statintjoueur.model';
import { JoueurService } from '../../services/joueur.service';
import { PosteService } from '../../services/poste.service';
import { StatistiqueService } from '../../services/statistique.service';
import { StatinterneService } from '../../services/statinterne.service';
import { AuthService } from '../../services/auth.service';
import { UtilisateurService, Utilisateur } from '../../services/utilisateur.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css',
})
export class AdminFormComponent implements OnInit {
  postes: Poste[] = [];
  statistiques: Statistique[] = [];
  statinternes: Statinterne[] = [];
  statsjoueur: Statjoueur[] = [];
  statintjoueur: Statintjoueur[] = [];
  statsOriginales: Statjoueur[] = [];
  statintOriginales: Statintjoueur[] = [];

  erreur: string = '';
  succes: string = '';
  chargement: boolean = false;
  estModification: boolean = false;
  joueurId: number | null = null;

  compteEmail: string = '';
  compteMdp: string = '';
  utilisateurLie: Utilisateur | null = null;

  joueur: Partial<Joueur> = {
    nom: '', prenom: '', nationality: '',
    numero: 0, taille: 0, poids: 0,
    datenaissance: '', id_poste: 0,
  };

  constructor(
    private joueurService: JoueurService,
    private posteService: PosteService,
    private statistiqueService: StatistiqueService,
    private statinterneService: StatinterneService,
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.posteService.getPostes().subscribe({
      next: (postes) => this.postes = postes
    });

    this.statistiqueService.getStatistiques().subscribe({
      next: (stats) => this.statistiques = stats
    });

    this.statinterneService.getStatinternes().subscribe({
      next: (stats) => this.statinternes = stats
    });

    if (id) {
      this.estModification = true;
      this.joueurId = Number(id);

      this.joueurService.getJoueurById(this.joueurId).subscribe({
        next: (joueur) => {
          this.joueur = { ...joueur };
          if (joueur.id_user) {
            this.utilisateurService.getById(joueur.id_user).subscribe({
              next: (utilisateur) => {
                this.utilisateurLie = utilisateur;
                this.cdr.detectChanges();
              }
            });
          }
          this.cdr.detectChanges();
        }
      });

      this.statistiqueService.getStatsByJoueur(this.joueurId).subscribe({
        next: (stats) => {
          this.statsjoueur = stats;
          this.statsOriginales = [...stats];
          this.cdr.detectChanges();
        }
      });

      this.statinterneService.getStatinternesByJoueur(this.joueurId).subscribe({
        next: (stats) => {
          this.statintjoueur = stats;
          this.statintOriginales = [...stats];
          this.cdr.detectChanges();
        }
      });
    }
  }

  getValeurStat(id_statistique: number): number {
    const stat = this.statsjoueur.find(s => Number(s.id_statistique) === Number(id_statistique));
    return stat ? stat.notes : 0;
  }

  setValeurStat(id_statistique: number, valeur: number): void {
    const stat = this.statsjoueur.find(s => Number(s.id_statistique) === Number(id_statistique));
    if (stat) {
      stat.notes = valeur;
    } else {
      this.statsjoueur.push({ id_joueur: this.joueurId!, id_statistique, notes: valeur });
    }
  }

  getValeurStatInterne(id_stat_interne: number): number {
    const stat = this.statintjoueur.find(s => Number(s.id_stat_interne) === Number(id_stat_interne));
    return stat ? stat.valeur : 0;
  }

  setValeurStatInterne(id_stat_interne: number, valeur: number): void {
    const stat = this.statintjoueur.find(s => Number(s.id_stat_interne) === Number(id_stat_interne));
    if (stat) {
      stat.valeur = valeur;
    } else {
      this.statintjoueur.push({ id_joueur: this.joueurId!, id_stat_interne, valeur });
    }
  }

  creerCompteEtLier() {
    this.erreur = '';
    this.chargement = true;

    this.authService.registerAsAdmin({
      email: this.compteEmail,
      password: this.compteMdp,
      username: this.compteEmail,
      nom: this.joueur.nom || '',
      prenom: this.joueur.prenom || ''
    }).subscribe({
      next: (response) => {
        this.utilisateurService.getByAspnetusersId(response.user.id).subscribe({
          next: (utilisateurs) => {
            if (utilisateurs.length > 0) {
              this.joueur.id_user = utilisateurs[0].id;
              this.utilisateurLie = utilisateurs[0];
              this.joueurService.updateJoueur(this.joueur as Joueur).subscribe({
                next: () => {
                  this.chargement = false;
                  this.succes = 'Compte créé et lié au joueur !';
                  this.compteEmail = '';
                  this.compteMdp = '';
                  this.cdr.detectChanges();
                },
                error: () => {
                  this.chargement = false;
                  this.erreur = 'Compte créé mais erreur lors de la liaison au joueur';
                }
              });
            }
          }
        });
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.errors?.[0] || 'Erreur lors de la création du compte';
      }
    });
  }

  onSubmit() {
    this.erreur = '';
    this.succes = '';
    this.chargement = true;

    if (this.estModification) {
      this.joueurService.updateJoueur(this.joueur as Joueur).subscribe({
        next: () => this.sauvegarderStats(),
        error: () => {
          this.chargement = false;
          this.erreur = 'Erreur lors de la modification du joueur';
        }
      });
    } else {
      this.authService.registerAsAdmin({
        email: this.compteEmail,
        password: this.compteMdp,
        username: this.compteEmail,
        nom: this.joueur.nom || '',
        prenom: this.joueur.prenom || ''
      }).subscribe({
        next: (response) => {
          this.utilisateurService.getByAspnetusersId(response.user.id).subscribe({
            next: (utilisateurs) => {
              if (utilisateurs.length > 0) {
                this.joueur.id_user = utilisateurs[0].id;
              }
              this.joueurService.addJoueur(this.joueur as Joueur).subscribe({
                next: () => {
                  this.chargement = false;
                  this.succes = 'Joueur et compte créés avec succès !';
                  setTimeout(() => this.router.navigate(['/admin']), 1500);
                },
                error: () => {
                  this.chargement = false;
                  this.erreur = 'Erreur lors de la création du joueur';
                }
              });
            }
          });
        },
        error: (err) => {
          this.chargement = false;
          this.erreur = err.error?.errors?.[0] || 'Erreur lors de la création du compte';
        }
      });
    }
  }

  sauvegarderStats() {
    const observables: any[] = [];

    this.statsjoueur.forEach(stat => {
      const existeOriginale = this.statsOriginales.find(s => Number(s.id_statistique) === Number(stat.id_statistique));
      if (existeOriginale) {
        observables.push(this.statistiqueService.updateStatJoueur(stat));
      } else {
        observables.push(this.statistiqueService.addStatJoueur(stat));
      }
    });

    this.statintjoueur.forEach(stat => {
      const existeOriginale = this.statintOriginales.find(s => Number(s.id_stat_interne) === Number(stat.id_stat_interne));
      if (existeOriginale) {
        observables.push(this.statinterneService.updateStatIntjoueur(stat));
      } else {
        observables.push(this.statinterneService.addStatIntjoueur(stat));
      }
    });

    if (observables.length === 0) {
      this.chargement = false;
      this.succes = 'Joueur modifié avec succès !';
      setTimeout(() => this.router.navigate(['/admin']), 1500);
      return;
    }

    forkJoin(observables).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Joueur modifié avec succès !';
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: () => {
        this.chargement = false;
        this.erreur = 'Erreur lors de la sauvegarde des stats';
      }
    });
  }
}