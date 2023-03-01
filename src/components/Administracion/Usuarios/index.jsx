import { Button } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../../firebase/firebase";
import CustomRecordViewer from "../../common/CustomRecordViewer/RecordViewer";
import { actions, headers } from "./usuario.config";

const Usuarios = () => {
  const navigate = useNavigate();
  const usersCollection = collection(db, "users");
  const [usuarios, setUsuarios] = useState([]);
  const location = useLocation();

  const onActionClick = (action, row) => {
    switch (action) {
      case "detalle":
        VerOEditarUsuario(row, true);
        break;
      case "editar":
        VerOEditarUsuario(row, false);
        break;
      case "eliminar":
        EliminarUsuario(row.idDoc);
      default:
        break;
    }
  };

  const EliminarUsuario = async (id) => {
    Swal.fire({
      title: 'Usuarios',
      text: '¿Esta seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then( async (result) => {
      if(result.isConfirmed){
        const userDoc = doc(db, "users", id);
        await deleteDoc(userDoc).then((res) => {
          Swal.fire(
            'Éxito',
            'El usuario se ha eliminado correctamente.',
            'success'
          ).then(() => {
            ObtenerUsuarios();
          });
        });
      }
    })

  };

  const VerOEditarUsuario = (row, detalle) => {
    navigate("./form", {
      state: {
        modelo: row,
        isDetalle: detalle
      },
    });
  };

  const ObtenerUsuarios = async () => {
    const data = await getDocs(usersCollection);
    if (!data.empty) {
      setUsuarios(data.docs.map((doc) => ({ idDoc: doc.id, ...doc.data() })));
    } else {
      setUsuarios([]);
    }
  };

  useEffect(() => {
    ObtenerUsuarios();
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.refetch === true) {
        ObtenerUsuarios();
      }
    }
  }, [location.state]);

  return (
    <>
      <div style={{ width: "82vw" }}>
        <CustomRecordViewer
          data={usuarios}
          columns={headers}
          textoBotonAdd={"Agregar usuario"}
          actions={actions}
          onActionClick={onActionClick}
        />
      </div>
    </>
  );
};

export default Usuarios;
