import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CategoriasListComponent } from './categorias-list/categorias-list.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { InventarioListComponent } from './inventario-list/inventario-list.component';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CategoriasListComponent,
    ClientesListComponent,
    InventarioListComponent,
    ProductosListComponent,
    ProveedoresListComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class AppComponent implements OnInit {
  title = 'proyectofinal';
  userRole: string | null = null;
  token: string | null = null;
  decodedToken: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.token = this.authService.getToken();
    this.userRole = this.authService.getRole();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/home']);
    alert('Has cerrado sesión exitosamente.');
  }
}
