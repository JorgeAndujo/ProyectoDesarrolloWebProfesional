import { Image, Popover } from "antd";
import { BellFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../../../zustand/useStore";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tipoMenu } = useStore();

  return (
    <>
      <div className="headerMenu">
        <div style={{ display: "flex" }}>
          <Image
            preview={false}
            onClick={() => navigate("./inicio")}
            src="./Logo.svg"
            style={{
              zIndex: 4000,
              margin: "1vw 1.5vw",
              width: "10vw",
              position: "absolute",
            }}
          />
          <div className="subMenus">
            {tipoMenu === "sinMenu" && (
              <>
                <div className="textoSinMenu">
                  Seleccione un menú de la parte izquierda
                </div>
              </>
            )}
            {tipoMenu === "Administracion" && (
              <>
                <div
                  className="itemMenu"
                  id={pathname.includes("usuarios") && "currentItemMenu"}
                  onClick={() => navigate("./usuarios")}
                >
                  Usuarios
                </div>
                <div
                  className="itemMenu"
                  id={pathname.includes("proveedores") && "currentItemMenu"}
                  onClick={() => navigate("./proveedores")}
                >
                  Proveedores
                </div>
              </>
            )}
            {tipoMenu === "Inventario" && (
              <>
                <div
                  className="itemMenu"
                  id={pathname.includes("inventario") && "currentItemMenu"}
                  onClick={() => navigate("./inventario")}
                >
                  Inventario
                </div>
                <div
                  className="itemMenu"
                  id={pathname.includes("movimientos") && "currentItemMenu"}
                  onClick={() => navigate("./movimientos")}
                >
                  Movimientos
                </div>
              </>
            )}
            {tipoMenu === "Ventas" && (
              <>
                <div
                  className="itemMenu"
                  id={pathname.includes("ventas") && "currentItemMenu"}
                  onClick={() => navigate("./ventas")}
                >
                  Ventas
                </div>
                <div
                  className="itemMenu"
                  id={pathname.includes("historialVentas") && "currentItemMenu"}
                  onClick={() => navigate("./historialVentas")}
                >
                  Historial de Ventas
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              padding: '1vw',
              backgroundColor: '#15458D',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.5vw',
            }}
          >
            <BellFilled style={{ color: 'white'}} />
          </div>
          <Popover
            placement='bottomRight'
            trigger='click'
            content={
              <div style={{ minWidth: '20vw', height: '10vw' }}>
                <div
                  style={{
                    fontFamily: 'TodaySHOP-Regular',
                    fontSize: '1.4vw',
                    textTransform: 'uppercase',
                    color: '#15458D',
                  }}
                >
                  ADMIN
                </div>
                <div
                  style={{
                    fontFamily: 'TodaySHOP-Regular',
                    fontSize: '1vw',
                    fontStyle: 'italic',
                    marginTop: '-0.5vw',
                  }}
                >
                  ADMINISTRADOR
                </div>
                <hr></hr>
                <div
                  style={{
                    cursor: 'pointer',
                    marginTop: '2.5vw',
                    fontFamily: 'TodaySHOP-Regular',
                    fontSize: '1.1vw',
                  }}
                >
                  Cambiar Contraseña
                </div>
                <div
                  style={{
                    cursor: 'pointer',
                    fontFamily: 'TodaySHOP-Regular',
                    fontSize: '1.1vw',
                  }}
                  onClick={() => {
                    localStorage.setItem("session", "false");
                    navigate("/login")
                  }}
                >
                  Cerrar Sesión
                </div>
              </div>
            }
          >
            <div className='userMenu'>
              <Image
                preview={false}
                src={"fotoperfil.jpg"}
                style={{
                  width: '3.5vw',
                  marginRight: '1vw',
                }}
              />
              ADMINISTRADOR
            </div>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Header;
