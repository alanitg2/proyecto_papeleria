import { Injectable } from '@angular/core';
import { Apollo, ApolloBase } from 'apollo-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApolloLink, FetchResult } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import gql from 'graphql-tag';
import { tap, map, catchError } from 'rxjs/operators';

interface Usuario {
  id: string;
  correo: string;
  nombre: string;
}

interface LoginResponse {
  usuarios: Usuario[];
}

interface RegisterResponse {
  insert_usuarios: {
    returning: Usuario[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';
  private hasuraAdminSecret = 'gE4YZF3Sq6A6rHx0H6XuVmepo152ZdEoV9P0qUBvDJwswuidgbmbrNFigy2xFSmC'; 
  private apolloClient: ApolloBase;
  private usuario: any = null;

  constructor(private apollo: Apollo, private http: HttpClient) {
    this.apolloClient = apollo.default();
    this.setupApollo();
    const token = this.getToken();
    if (token) {
      const usuario = this.parseJwt(token);
      this.usuario = usuario ? usuario['https://hasura.io/jwt/claims'] : null;
    }
  }

  setToken(token: string) {
    localStorage.setItem(this.authTokenKey, token);
    const usuario = this.parseJwt(token);
    this.usuario = usuario ? usuario['https://hasura.io/jwt/claims'] : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.authTokenKey);
    this.usuario = null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  login(correo: string, contrasena: string): Observable<FetchResult<{ usuarios: Usuario[] }>> {
    const LOGIN_QUERY = gql`
      query Login($correo: String!, $contrasena: String!) {
        usuarios(where: {correo: {_eq: $correo}, contrasena: {_eq: $contrasena}}) {
          id
          correo
          nombre
        }
      }
    `;
    return this.fetchWithAuth<{ usuarios: Usuario[] }>(LOGIN_QUERY, { correo, contrasena }).pipe(
      tap(response => {
        if (response.data && response.data.usuarios.length) {
          this.http.post<{ token: string }>('http://localhost:3000/generate-token', { userId: response.data.usuarios[0].id, role: 'user' })
            .subscribe(tokenResponse => {
              this.setToken(tokenResponse.token);
            });
        }
      }),
      map(response => {
        if (!response.data || response.data.usuarios.length === 0) {
          throw new Error('Usuario o contraseña incorrectos');
        }
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  register(nombre: string, correo: string, contrasena: string): Observable<FetchResult<RegisterResponse>> {
    const REGISTER_MUTATION = gql`
      mutation Register($nombre: String!, $correo: String!, $contrasena: String!) {
        insert_usuarios(objects: {nombre: $nombre, correo: $correo, contrasena: $contrasena}) {
          returning {
            id
            nombre
            correo
          }
        }
      }
    `;
    return this.apolloClient.mutate<RegisterResponse>({
      mutation: REGISTER_MUTATION,
      variables: { nombre, correo, contrasena },
      context: {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'x-hasura-admin-secret': this.hasuraAdminSecret
        }
      }
    }).pipe(
      tap(response => {
        if (response.data && response.data.insert_usuarios.returning.length) {
          const emailData = {
            correo: response.data.insert_usuarios.returning[0].correo
          };
          this.http.post('http://localhost:3000/register-email', emailData).subscribe({
            next: (emailResponse) => {
              console.log('Correo de registro enviado:', emailResponse);
            },
            error: (emailError: HttpErrorResponse) => {
              console.error('Error al enviar correo de registro:', emailError);
            }
          });
        }
      }),
      catchError(error => {
        console.error('Error en la mutación de registro:', error);
        return throwError(error);
      })
    );
  }

  private setupApollo() {
    const httpLink = this.apolloClient.client.link;

    const authLink = setContext((operation, { headers }) => {
      const token = this.getToken();
      const authHeaders = {
        Authorization: token ? `Bearer ${token}` : '',
        'x-hasura-admin-secret': this.hasuraAdminSecret
      };
      return {
        headers: {
          ...headers,
          ...authHeaders
        }
      };
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    });

    const link = ApolloLink.from([authLink, errorLink, httpLink]);

    this.apolloClient.client.setLink(link);
  }

  fetchWithAuth<T>(query: any, variables: any = {}): Observable<FetchResult<T>> {
    return this.apolloClient.query<T>({
      query: query,
      variables: variables,
      fetchPolicy: 'network-only',
      context: {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'x-hasura-admin-secret': this.hasuraAdminSecret
        }
      }
    });
  }

  private parseJwt(token: string): any {
    if (!token) {
      return null;
    }
  
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Token mal formado');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token', error);
      return null;
    }
  }

  getUsuario() {
    return this.usuario;
  }

  getRole(): string | null {
    if (this.usuario) {
      return this.usuario['x-hasura-default-role'] || null;
    }
    return null;
  }

  logout() {
    this.removeToken();
  }
}
