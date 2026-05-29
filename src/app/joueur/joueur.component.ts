import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Joueur } from '../models/joueur.model';

@Component({
  selector: '[app-joueur]', 
  imports: [CommonModule, RouterModule],
  templateUrl: './joueur.component.html',
  styleUrl: './joueur.component.css',
})
export class JoueurComponent {
  @Input() joueur!: Joueur;
  @Input() nomPoste!: string;
}