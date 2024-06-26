import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_CLIENTES = gql`
  query GetClientes {
    cliente {
      id
      nombre
      direccion
      telefono
    }
  }
`;

const CREATE_CLIENTE = gql`
  mutation CreateCliente($nombre: String!, $direccion: String!, $telefono: String!) {
    insert_cliente(objects: {nombre: $nombre, direccion: $direccion, telefono: $telefono}) {
      returning {
        id
        nombre
        direccion
        telefono
      }
    }
  }
`;

const UPDATE_CLIENTE = gql`
  mutation UpdateCliente($id: Int!, $nombre: String!, $direccion: String!, $telefono: String!) {
    update_cliente(where: {id: {_eq: $id}}, _set: {nombre: $nombre, direccion: $direccion, telefono: $telefono}) {
      returning {
        id
        nombre
        direccion
        telefono
      }
    }
  }
`;

const DELETE_CLIENTE = gql`
  mutation DeleteCliente($id: Int!) {
    delete_cliente(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private apollo: Apollo) {}

  getClientes(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CLIENTES
    }).valueChanges;
  }

  createCliente(nombre: string, direccion: string, telefono: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CLIENTE,
      variables: {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono
      }
    });
  }

  updateCliente(id: number, nombre: string, direccion: string, telefono: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CLIENTE,
      variables: {
        id: id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono
      }
    });
  }

  deleteCliente(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CLIENTE,
      variables: {
        id: id
      }
    });
  }
}
