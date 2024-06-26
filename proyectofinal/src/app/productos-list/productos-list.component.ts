import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductosListComponent implements OnInit {
  productos: any[] = [];
  newProducto: any = {
    nombre: '',
    precio: 0,
    categoria_id: null,
    proveedor_id: null,
  };
  editProductoData: any = {
    id: null,
    nombre: '',
    precio: 0,
    categoria_id: null,
    proveedor_id: null,
  };
  editMode = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.productoService.getProductos().subscribe((result: any) => {
      this.productos = result.data.producto;
    });
  }

  addProducto() {
    const { nombre, precio, categoria_id, proveedor_id } = this.newProducto;
    this.productoService.createProducto(nombre, precio, categoria_id, proveedor_id).subscribe(() => {
      this.loadProductos();
      this.newProducto = {
        nombre: '',
        precio: 0,
        categoria_id: null,
        proveedor_id: null,
      };
    });
  }

  editProducto(producto: any) {
    this.editProductoData = { ...producto };
    this.editMode = true;
  }

  updateProducto() {
    const { id, nombre, precio, categoria_id, proveedor_id } = this.editProductoData;
    this.productoService.updateProducto(id, nombre, precio, categoria_id, proveedor_id).subscribe(() => {
      this.loadProductos();
      this.editMode = false;
      this.editProductoData = {
        id: null,
        nombre: '',
        precio: 0,
        categoria_id: null,
        proveedor_id: null,
      };
    });
  }

  deleteProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe(() => {
      this.loadProductos();
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editProductoData = {
      id: null,
      nombre: '',
      precio: 0,
      categoria_id: null,
      proveedor_id: null,
    };
  }
}
