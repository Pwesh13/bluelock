import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: LoginDto = { email: '', password: '' };
  erreur: string = '';
  chargement: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.erreur = '';
    this.chargement = true;

    this.authService.login(this.form).subscribe({
      next: () => {
        this.chargement = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}