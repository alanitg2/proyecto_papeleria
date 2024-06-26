import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientesListComponent implements OnInit {
  clientes: any[] = [];
  newCliente = { nombre: '', direccion: '', telefono: '' };
  editClienteData = { id: null as number | null, nombre: '', direccion: '', telefono: '' };
  editMode = false;
  error: string | null = null;

  constructor(private clienteService: ClienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe(
      (result: any) => {
        this.clientes = result.data.cliente;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error leyendo clientes:', error);
        this.error = 'Error leyendo clientes';
        this.cdr.detectChanges();
      }
    );
  }

  addCliente() {
    this.clienteService.createCliente(this.newCliente.nombre, this.newCliente.direccion, this.newCliente.telefono).subscribe(
      () => {
        this.loadClientes();
        this.newCliente = { nombre: '', direccion: '', telefono: '' };
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error creando cliente:', error);
        this.error = 'Error creando cliente';
        this.cdr.detectChanges(); 
      }
    );
  }

  editCliente(cliente: any) {
    this.editMode = true;
    this.editClienteData = { ...cliente };
    this.cdr.detectChanges(); 
  }

  updateCliente() {
    if (this.editClienteData.id !== null) {
      this.clienteService.updateCliente(this.editClienteData.id, this.editClienteData.nombre, this.editClienteData.direccion, this.editClienteData.telefono).subscribe(
        () => {
          this.loadClientes();
          this.cancelEdit();
          this.cdr.detectChanges(); 
        },
        (error) => {
          console.error('Error actualizando cliente:', error);
          this.error = 'Error actualizando cliente';
          this.cdr.detectChanges(); 
        }
      );
    }
  }

  deleteCliente(id: number) {
    this.clienteService.deleteCliente(id).subscribe(
      () => {
        this.loadClientes();
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error eliminando cliente:', error);
        this.error = 'Error eliminando cliente';
        this.cdr.detectChanges(); 
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.editClienteData = { id: null, nombre: '', direccion: '', telefono: '' };
    this.cdr.detectChanges(); 
  }
}
