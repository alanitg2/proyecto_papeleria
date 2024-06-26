import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_PROVEEDORES = gql`
  query GetProveedores {
    proveedor {
      id
      nombre
      contacto_nombre
      contacto_telefono
    }
  }
`;

const CREATE_PROVEEDOR = gql`
  mutation CreateProveedor($nombre: String!, $contacto_nombre: String, $contacto_telefono: String) {
    insert_proveedor(objects: {nombre: $nombre, contacto_nombre: $contacto_nombre, contacto_telefono: $contacto_telefono}) {
      returning {
        id
        nombre
        contacto_nombre
        contacto_telefono
      }
    }
  }
`;

const UPDATE_PROVEEDOR = gql`
  mutation UpdateProveedor($id: Int!, $nombre: String!, $contacto_nombre: String, $contacto_telefono: String) {
    update_proveedor(where: {id: {_eq: $id}}, _set: {nombre: $nombre, contacto_nombre: $contacto_nombre, contacto_telefono: $contacto_telefono}) {
      returning {
        id
        nombre
        contacto_nombre
        contacto_telefono
      }
    }
  }
`;

const DELETE_PROVEEDOR = gql`
  mutation DeleteProveedor($id: Int!) {
    delete_proveedor(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private apollo: Apollo) {}

  getProveedores(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_PROVEEDORES
    }).valueChanges;
  }

  createProveedor(nombre: string, contacto_nombre: string, contacto_telefono: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_PROVEEDOR,
      variables: {
        nombre: nombre,
        contacto_nombre: contacto_nombre,
        contacto_telefono: contacto_telefono
      }
    });
  }

  updateProveedor(id: number, nombre: string, contacto_nombre: string, contacto_telefono: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PROVEEDOR,
      variables: {
        id: id,
        nombre: nombre,
        contacto_nombre: contacto_nombre,
        contacto_telefono: contacto_telefono
      }
    });
  }

  deleteProveedor(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_PROVEEDOR,
      variables: {
        id: id
      }
    });
  }
}
