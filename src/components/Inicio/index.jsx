import React from "react";

const Inicio = () => {

  return (
    <>
      <div
        className="textoBienvenida"
        style={{
          textTransform: "uppercase",
          fontSize: "2vw",
          fontFamily: "TodaySHOP-Bold",
        }}
      >
        BIENVENIDO A{" "}
        <span style={{ color: "#15458D", fontSize: "2.5vw" }}>
          INVENTARIO SUPER "EL INGE"
        </span>
        <br />
      </div>
    </>
  );
};

export default Inicio;
