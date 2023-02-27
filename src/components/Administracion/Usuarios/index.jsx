import { Button } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import CustomRecordViewer from "../../common/CustomRecordViewer/RecordViewer";
import { headers } from "./usuario.config";

const Usuarios = () => {
  const navigate = useNavigate();
  const usersCollection = collection(db, "users");
  const [usuarios, setUsuarios] = useState([]);

  const ObtenerUsuarios = async () => {
    const data = await getDocs(usersCollection);
    if(!data.empty){
      setUsuarios(data.docs.map((doc) => ({idDoc: doc.id, ...doc.data()})));
    } else{
      setUsuarios([]);
    }
  }

  useEffect(() => {
    ObtenerUsuarios();
  }, []);

  return (
    <>
      <div style={{ width: "82vw" }}>
        <CustomRecordViewer 
          data={usuarios}
          columns={headers}
          textoBotonAdd={"Agregar usuario"}
        />
      </div>
    </>
  );
};

export default Usuarios;
