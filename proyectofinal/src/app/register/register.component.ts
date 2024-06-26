import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, correo, contrasena } = this.registerForm.value;
      this.authService.register(nombre, correo, contrasena).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);

          this.http.post('http://localhost:3000/register-email', { correo }).subscribe({
            next: (emailResponse) => {
              console.log('Correo de registro enviado:', emailResponse);
              alert('Registro exitoso. Se ha enviado un correo de confirmación.');
            },
            error: (emailError: HttpErrorResponse) => {
              console.error('Error al enviar correo de registro:', emailError);
              alert('Hubo un problema al enviar el correo de confirmación de registro.');
            }
          });

          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Error al registrar. Por favor, inténtalo de nuevo.';
          console.error('Error al registrar:', error);
        }
      });
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
