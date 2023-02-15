import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers/reducers';

export default function configureStoreState() {
  const store = configureStore({
    reducer: reducers,
  });

  return store;
}
