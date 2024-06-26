import { Routes } from '@angular/router';
import { CategoriasListComponent } from './categorias-list/categorias-list.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { InventarioListComponent } from './inventario-list/inventario-list.component';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'categorias', component: CategoriasListComponent },
  { path: 'clientes', component: ClientesListComponent },
  { path: 'inventario', component: InventarioListComponent },
  { path: 'productos', component: ProductosListComponent },
  { path: 'proveedores', component: ProveedoresListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
