import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private emailService: EmailService, 
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { correo, contrasena } = this.loginForm.value;
      this.authService.login(correo, contrasena).subscribe({
        next: (response) => {
          console.log('Usuario logueado:', response);
          this.emailService.sendEmail(
            correo,
            'Inicio de sesión exitoso',
            'Has iniciado sesión exitosamente en nuestro sistema.'
          ).subscribe({
            next: (emailResponse) => console.log('Correo de inicio de sesión enviado:', emailResponse),
            error: (emailError: HttpErrorResponse) => {
              console.error('Error al enviar correo de inicio de sesión:', emailError);
              console.log(emailError.error); // Log the error response from the server
            }
          });
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          this.errorMessage = error.error.message === 'Usuario o contraseña incorrectos'
            ? 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.'
            : 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
          console.error('Error al iniciar sesión:', error);
        }
      });
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
