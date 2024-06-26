import gql from 'graphql-tag';

export const LOGIN_QUERY = gql`
  query Login($correo: String!, $contraseña: String!) {
    usuario: users(where: {correo: {_eq: $correo}, contraseña: {_eq: $contraseña}}) {
      id
      correo
      nombre
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($nombre: String!, $correo: String!, $contraseña: String!) {
    insert_users(objects: {nombre: $nombre, correo: $correo, contraseña: $contraseña}) {
      returning {
        id
        nombre
        correo
      }
    }
  }
`;
export interface Usuario {
  id: string;
  correo: string;
  nombre: string;
}

export interface LoginResponse {
  usuarios: Usuario[];
}

export interface RegisterResponse {
  insert_usuarios: {
    returning: Usuario[];
  };
}
