import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../services/inventario.service';

@Component({
  selector: 'app-inventario-list',
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InventarioListComponent implements OnInit {
  inventarios: any[] = [];
  newInventario = { producto_id: null as number | null, cantidad: null as number | null };
  editInventarioData = { producto_id: null as number | null, cantidad: null as number | null };
  editMode = false;
  error: string | null = null;

  constructor(private inventarioService: InventarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadInventarios();
  }

  loadInventarios() {
    this.inventarioService.getInventarios().subscribe(
      (result: any) => {
        this.inventarios = result.data.inventario;
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error leyendo inventarios:', error);
        this.error = 'Error leyendo inventarios';
        this.cdr.detectChanges(); 
      }
    );
  }

  addInventario() {
    if (this.newInventario.producto_id !== null && this.newInventario.cantidad !== null) {
      this.inventarioService.createInventario(this.newInventario.producto_id, this.newInventario.cantidad).subscribe(
        () => {
          this.loadInventarios();
          this.newInventario = { producto_id: null, cantidad: null };
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error creando inventario:', error);
          this.error = 'Error creando inventario';
          this.cdr.detectChanges(); 
        }
      );
    }
  }

  editInventario(inventario: any) {
    this.editMode = true;
    this.editInventarioData = { ...inventario };
    this.cdr.detectChanges(); 
  }

  updateInventario() {
    if (this.editInventarioData.producto_id !== null && this.editInventarioData.cantidad !== null) {
      this.inventarioService.updateInventario(this.editInventarioData.producto_id, this.editInventarioData.cantidad).subscribe(
        () => {
          this.loadInventarios();
          this.cancelEdit();
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error actualizando inventario:', error);
          this.error = 'Error actualizando inventario';
          this.cdr.detectChanges(); 
        }
      );
    }
  }

  deleteInventario(producto_id: number) {
    this.inventarioService.deleteInventario(producto_id).subscribe(
      () => {
        this.loadInventarios();
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error eliminando inventario:', error);
        this.error = 'Error eliminando inventario';
        this.cdr.detectChanges();
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.editInventarioData = { producto_id: null, cantidad: null };
    this.cdr.detectChanges();
  }
}
