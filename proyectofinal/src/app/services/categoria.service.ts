import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_CATEGORIAS = gql`
  query GetCategorias {
    categoria {
      id
      nombre
      descripcion
    }
  }
`;

const CREATE_CATEGORIA = gql`
  mutation CreateCategoria($nombre: String!, $descripcion: String!) {
    insert_categoria(objects: {nombre: $nombre, descripcion: $descripcion}) {
      returning {
        id
        nombre
        descripcion
      }
    }
  }
`;

const UPDATE_CATEGORIA = gql`
  mutation UpdateCategoria($id: Int!, $nombre: String!, $descripcion: String!) {
    update_categoria(where: {id: {_eq: $id}}, _set: {nombre: $nombre, descripcion: $descripcion}) {
      returning {
        id
        nombre
        descripcion
      }
    }
  }
`;

const DELETE_CATEGORIA = gql`
  mutation DeleteCategoria($id: Int!) {
    delete_categoria(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private apollo: Apollo) {}

  getCategorias(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CATEGORIAS
    }).valueChanges;
  }

  createCategoria(nombre: string, descripcion: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CATEGORIA,
      variables: {
        nombre: nombre,
        descripcion: descripcion
      }
    });
  }

  updateCategoria(id: number, nombre: string, descripcion: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CATEGORIA,
      variables: {
        id: id,
        nombre: nombre,
        descripcion: descripcion
      }
    });
  }

  deleteCategoria(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CATEGORIA,
      variables: {
        id: id
      }
    });
  }
}
