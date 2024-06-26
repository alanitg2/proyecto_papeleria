import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../services/categoria.service';
import { EmailService } from '../services/email.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-categorias-list',
  templateUrl: './categorias-list.component.html',
  styleUrls: ['./categorias-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoriasListComponent implements OnInit {
  categorias: any[] = [];
  newCategoria = { nombre: '', descripcion: '' };
  editCategoriaData = { id: null as number | null, nombre: '', descripcion: '' };
  editMode = false;
  error: string | null = null;
  userEmail: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private emailService: EmailService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadUserEmail();
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (result: any) => {
        this.categorias = result.data.categoria;
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error leyendo categorias:', error);
        this.error = 'Error leyendo categorias';
        this.cdr.detectChanges(); 
      }
    );
  }

  loadUserEmail() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.userEmail = usuario['x-hasura-user-id'] || ''; // Ajusta esto según la estructura de tu token
      this.cdr.detectChanges();
    } else {
      console.error('No se encontró el usuario autenticado');
      this.error = 'No se encontró el usuario autenticado';
      this.cdr.detectChanges();
    }
  }

  addCategoria() {
    this.categoriaService.createCategoria(this.newCategoria.nombre, this.newCategoria.descripcion).subscribe(
      () => {
        this.loadCategorias();
        this.sendChangeReceipt('add', this.newCategoria.nombre);
        this.newCategoria = { nombre: '', descripcion: '' };
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error creando categoria:', error);
        this.error = 'Error creando categoria';
        this.cdr.detectChanges();
      }
    );
  }

  editCategoria(categoria: any) {
    this.editMode = true;
    this.editCategoriaData = { ...categoria };
    this.cdr.detectChanges(); 
  }

  updateCategoria() {
    if (this.editCategoriaData.id !== null) {
      this.categoriaService.updateCategoria(this.editCategoriaData.id, this.editCategoriaData.nombre, this.editCategoriaData.descripcion).subscribe(
        () => {
          this.loadCategorias();
          this.sendChangeReceipt('update', this.editCategoriaData.nombre);
          this.cancelEdit();
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error actualizando categoria:', error);
          this.error = 'Error actualizando categoria';
          this.cdr.detectChanges(); 
        }
      );
    }
  }

  deleteCategoria(id: number) {
    const deletedCategory = this.categorias.find(cat => cat.id === id);
    this.categoriaService.deleteCategoria(id).subscribe(
      () => {
        this.loadCategorias();
        if (deletedCategory) {
          this.sendChangeReceipt('delete', deletedCategory.nombre);
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error eliminando categoria:', error);
        this.error = 'Error eliminando categoria';
        this.cdr.detectChanges();
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.editCategoriaData = { id: null, nombre: '', descripcion: '' };
    this.cdr.detectChanges();
  }

  sendChangeReceipt(action: string, categoryName: string) {
    const subject = 'Comprobante de cambios';
    const text = 'Adjunto encontrará el comprobante de cambios realizados en las categorías.';

    this.emailService.sendChangeReceipt(this.userEmail, subject, text, action, categoryName).subscribe({
      next: (response) => console.log('Correo enviado con éxito:', response),
      error: (error) => console.error('Error al enviar el correo:', error)
    });
  }
}
