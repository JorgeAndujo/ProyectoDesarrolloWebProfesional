import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Layout from "./components/common/Layout";
import generateGuid from "./utils/generateGuid";
import { usuarioLogueado } from "./utils/loggedInfo";

const AccountRouter = lazy(() => import("./components/Account"));
const InicioRouter = lazy(() => import("./components/Inicio"));
const LoginRouter = lazy(() => import("./components/Account/Login"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));

//Rutas de administracion
const UsuariosRouter = lazy(() => import("./components/Administracion/Usuarios"));
const FormUsuarios = lazy(() => import("./components/Administracion/Usuarios/form"));
const ProveedoresRouter = lazy(() => import("./components/Administracion/Proveedores"));

//Rutas de inventario
const InventarioRouter = lazy(() => import("./components/Inventario/Inventario"));
const MovimientosRouter = lazy(() => import("./components/Inventario/Movimientos"));

//Rutas de ventas
const VentasRouter = lazy(() => import("./components/Ventas/Ventas"));
const HistorialVentasRouter = lazy(() => import("./components/Ventas/HistorialVentas"));

const listaDePaginas = [
  "/login",
  "/registrar-usuario",
  "/recuperar-contrasenia",
];

const RoutesDir = () => {
  const session = localStorage.getItem("session");
  const location = useLocation();
  const currentKey = generateGuid();
  const timeout = { enter: 500, exit: 500 };
  const animationName = "rag-fadeInLeft";

  if (listaDePaginas.indexOf(location.pathname) > -1 || usuarioLogueado() == null) {
    return (
      <Suspense fallback={() => <div>Cargando...</div>}>
        <Routes>
          <Route path={"*"} element={<AccountRouter />} />
        </Routes>
      </Suspense>
    );
  } else {
    return (
      <>
        <Layout>
          <TransitionGroup>
            <CSSTransition
              key={currentKey}
              timeout={timeout}
              classNames={animationName}
              exit={false}
            >
              <Suspense fallback={() => <div>Cargando...</div>}>
                <Routes>
                  <Route path="/inicio" element={<InicioRouter />} />

                  {/* RUTAS DE ADMINISTRACION */}
                  <Route path={"/usuarios"} element={<UsuariosRouter />}/>
                  <Route path={"/usuarios/form"} element={<FormUsuarios />} />
                  <Route path={"/proveedores"} element={<ProveedoresRouter />}/>

                  {/* RUTAS DE INVENTARIO */}
                  <Route path={"/inventario"} element={<InventarioRouter />}/>
                  <Route path={"/movimientos"} element={<MovimientosRouter />}/>

                  {/* RUTAS DE VENTAS */}
                  <Route path={"/ventas"} element={<VentasRouter />}/>
                  <Route path={"/historialVentas"} element={<HistorialVentasRouter />}/>

                  <Route path={"*"} element={<NotFound />}/>
                  
                </Routes>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        </Layout>
      </>
    );
  }
};

export default RoutesDir;
