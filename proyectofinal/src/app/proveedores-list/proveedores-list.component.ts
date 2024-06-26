import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../services/proveedor.service';

@Component({
  selector: 'app-proveedores-list',
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProveedoresListComponent implements OnInit {
  proveedores: any[] = [];
  newProveedor = { nombre: '', contacto_nombre: '', contacto_telefono: '' };
  editProveedorData = { id: null as number | null, nombre: '', contacto_nombre: '', contacto_telefono: '' };
  editMode = false;
  error: string | null = null;

  constructor(private proveedorService: ProveedorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores() {
    this.proveedorService.getProveedores().subscribe(
      (result: any) => {
        this.proveedores = result.data.proveedor;
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error leyendo proveedores:', error);
        this.error = 'Error leyendo proveedores';
        this.cdr.detectChanges(); 
      }
    );
  }

  addProveedor() {
    if (this.newProveedor.nombre) {
      this.proveedorService.createProveedor(this.newProveedor.nombre, this.newProveedor.contacto_nombre, this.newProveedor.contacto_telefono).subscribe(
        () => {
          this.loadProveedores();
          this.newProveedor = { nombre: '', contacto_nombre: '', contacto_telefono: '' };
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error creando proveedor:', error);
          this.error = 'Error creando proveedor';
          this.cdr.detectChanges();
        }
      );
    }
  }

  editProveedor(proveedor: any) {
    this.editMode = true;
    this.editProveedorData = { ...proveedor };
    this.cdr.detectChanges(); 
  }

  updateProveedor() {
    if (this.editProveedorData.id !== null) {
      this.proveedorService.updateProveedor(this.editProveedorData.id, this.editProveedorData.nombre, this.editProveedorData.contacto_nombre, this.editProveedorData.contacto_telefono).subscribe(
        () => {
          this.loadProveedores();
          this.cancelEdit();
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error actualizando proveedor:', error);
          this.error = 'Error actualizando proveedor';
          this.cdr.detectChanges();
        }
      );
    }
  }

  deleteProveedor(id: number) {
    this.proveedorService.deleteProveedor(id).subscribe(
      () => {
        this.loadProveedores();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error eliminando proveedor:', error);
        this.error = 'Error eliminando proveedor';
        this.cdr.detectChanges(); 
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.editProveedorData = { id: null, nombre: '', contacto_nombre: '', contacto_telefono: '' };
    this.cdr.detectChanges(); 
  }
}
