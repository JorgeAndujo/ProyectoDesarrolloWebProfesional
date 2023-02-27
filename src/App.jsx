import './App.css';
import RoutesDir from './RoutesDir';
import './styles/estilos_generales.css';

function App() {
  localStorage.setItem('user', 'admin');
  localStorage.setItem('pass', 'admin123');
  localStorage.setItem('session', 'false');
  return (
    <>
      <RoutesDir />
    </>
  );
}

export default App;
