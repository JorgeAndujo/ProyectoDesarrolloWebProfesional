import create from 'zustand';
import { persist } from 'zustand/middleware';

const setValue = (set, item, value) => set({ [item]: value });


const useStore = create(
  persist(
    (set, get) => ({
      // Global States
      tipoMenu: 'sinMenu',

      // Set Values
      setStore: (data) => {
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            setValue(set, key, data[key]);
          }
        }
      },

      setTipoMenu: (data) => setValue(set, 'tipoMenu', data),
    }),
    {
      name: '_inventarioSM',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
