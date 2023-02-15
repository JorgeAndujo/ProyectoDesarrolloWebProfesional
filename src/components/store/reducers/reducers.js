import { combineReducers } from 'redux';
import settingsReducer from './settings.reducer';

export default combineReducers({
  settingsReducer: settingsReducer,
});
