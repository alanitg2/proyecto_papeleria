import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_PRODUCTOS = gql`
  query GetProductos {
    producto {
      id
      nombre
      precio
      categoria_id
      proveedor_id
    }
  }
`;

const CREATE_PRODUCTO = gql`
  mutation CreateProducto($nombre: String!, $precio: Float!, $categoria_id: Int!, $proveedor_id: Int!) {
    insert_producto(objects: {nombre: $nombre, precio: $precio, categoria_id: $categoria_id, proveedor_id: $proveedor_id}) {
      returning {
        id
        nombre
        precio
        categoria_id
        proveedor_id
      }
    }
  }
`;

const UPDATE_PRODUCTO = gql`
  mutation UpdateProducto($id: Int!, $nombre: String!, $precio: Float!, $categoria_id: Int!, $proveedor_id: Int!) {
    update_producto(where: {id: {_eq: $id}}, _set: {nombre: $nombre, precio: $precio, categoria_id: $categoria_id, proveedor_id: $proveedor_id}) {
      returning {
        id
        nombre
        precio
        categoria_id
        proveedor_id
      }
    }
  }
`;

const DELETE_PRODUCTO = gql`
  mutation DeleteProducto($id: Int!) {
    delete_producto(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private apollo: Apollo) {}

  getProductos(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_PRODUCTOS
    }).valueChanges;
  }

  createProducto(nombre: string, precio: number, categoria_id: number, proveedor_id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_PRODUCTO,
      variables: {
        nombre: nombre,
        precio: precio,
        categoria_id: categoria_id,
        proveedor_id: proveedor_id
      }
    });
  }

  updateProducto(id: number, nombre: string, precio: number, categoria_id: number, proveedor_id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PRODUCTO,
      variables: {
        id: id,
        nombre: nombre,
        precio: precio,
        categoria_id: categoria_id,
        proveedor_id: proveedor_id
      }
    });
  }

  deleteProducto(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_PRODUCTO,
      variables: {
        id: id
      }
    });
  }
}
