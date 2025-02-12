import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './components/navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const jwtExpireRedirect = () => {
  const token = localStorage.getItem('id_token');
  if (!token) {
    window.location.replace('/');
  }
};

function App() {
  const location = useLocation();

  const isCoverPage = location.pathname === '/';

  jwtExpireRedirect();

  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className={isCoverPage ? '' : 'p-3 p-md-4 p-lg-5'}>
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
