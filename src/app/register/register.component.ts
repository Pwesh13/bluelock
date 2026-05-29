import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: RegisterDto = {
    email: '',
    password: '',
    username: '',
    nom: '',
    prenom: ''
  };
  erreur: string = '';
  chargement: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.erreur = '';
    this.chargement = true;

    this.authService.register(this.form).subscribe({
      next: () => {
        this.chargement = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.errors?.[0] || 'Une erreur est survenue';
      }
    });
  }
}