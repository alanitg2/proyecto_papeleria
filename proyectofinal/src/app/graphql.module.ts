import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, from } from '@apollo/client/link/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { environment } from '../environments/environment';

const uri = 'https://proyectofinal.hasura.app/v1/graphql'; 

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => {
        const http = httpLink.create({ uri });

        const authLink = setContext((_, { headers }) => {
          const token = localStorage.getItem('authToken');
          return {
            headers: {
              ...headers,
              Authorization: token ? `Bearer ${token}` : '',
              'x-hasura-admin-secret': 'gE4YZF3Sq6A6rHx0H6XuVmepo152ZdEoV9P0qUBvDJwswuidgbmbrNFigy2xFSmC',
            },
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

        const link = from([authLink, errorLink, http]);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
