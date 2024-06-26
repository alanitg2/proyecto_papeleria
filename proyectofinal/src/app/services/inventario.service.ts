import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_INVENTARIOS = gql`
  query GetInventarios {
    inventario {
      producto_id
      cantidad
    }
  }
`;

const CREATE_INVENTARIO = gql`
  mutation CreateInventario($producto_id: Int!, $cantidad: Int!) {
    insert_inventario(objects: {producto_id: $producto_id, cantidad: $cantidad}) {
      returning {
        producto_id
        cantidad
      }
    }
  }
`;

const UPDATE_INVENTARIO = gql`
  mutation UpdateInventario($producto_id: Int!, $cantidad: Int!) {
    update_inventario(where: {producto_id: {_eq: $producto_id}}, _set: {cantidad: $cantidad}) {
      returning {
        producto_id
        cantidad
      }
    }
  }
`;

const DELETE_INVENTARIO = gql`
  mutation DeleteInventario($producto_id: Int!) {
    delete_inventario(where: {producto_id: {_eq: $producto_id}}) {
      returning {
        producto_id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private apollo: Apollo) {}

  getInventarios(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_INVENTARIOS
    }).valueChanges;
  }

  createInventario(producto_id: number, cantidad: number): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_INVENTARIO,
      variables: {
        producto_id: producto_id,
        cantidad: cantidad
      }
    });
  }

  updateInventario(producto_id: number, cantidad: number): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_INVENTARIO,
      variables: {
        producto_id: producto_id,
        cantidad: cantidad
      }
    });
  }

  deleteInventario(producto_id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_INVENTARIO,
      variables: {
        producto_id: producto_id
      }
    });
  }
}
