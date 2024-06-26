import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './app/graphql.module';
import { AppComponent } from './app/app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { environment } from './environments/environment';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

const createApollo = (httpLink: HttpLink) => {
  return {
    link: httpLink.create({ uri: environment.graphqlUri }),
    cache: new InMemoryCache(),
  };
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(FormsModule, ReactiveFormsModule, GraphQLModule, HttpClientModule, ApolloModule),
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
});
