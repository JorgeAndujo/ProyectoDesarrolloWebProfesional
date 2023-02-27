import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import configureStoreState from './components/store/store';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

const store = configureStoreState();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Suspense fallback={() => <div>Cargando...</div>}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
  </Provider>
);
