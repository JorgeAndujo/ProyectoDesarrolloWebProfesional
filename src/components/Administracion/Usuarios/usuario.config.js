import { Image } from "antd";
import { Roles } from "../../pipes/enums";
import {
  EditOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export const headers = [
  {
    title: "Nombre",
    key: "name",
    dataIndex: "name",
    render: (_, row) => (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 80,
              height: 75,
              objectFit: "cover",
            }}
            src={row.urlImage}
            fallback={"..."}
            preview={{
              src: row.urlImagen,
            }}
          ></Image>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <span style={{ fontWeight: 700 }}>
              {row.lastName.toUpperCase()}
            </span>
            <span>{row.firstName.toUpperCase()}</span>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Contacto",
    key: "mail",
    dataIndex: "mail",
    render: (_, row) => (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ fontWeight: 700 }}>{row.mail.toUpperCase()}</span>
          <span>{row.numPhone}</span>
        </div>
      </>
    ),
  },
  {
    title: "Rol",
    key: "rol",
    dataIndex: "rol",
    render: (_, row) => <div>{Roles[row.rol]}</div>,
  },
];

export const actions = [
  {
    key: "detalle",
    tooltip: "Detalle",
    icon: <EyeOutlined />,
  },
  {
    key: "editar",
    tooltip: "Editar",
    icon: <EditOutlined />,
  },
  {
    key: "eliminar",
    tooltip: "Eliminar",
    icon: <CloseCircleOutlined />,
  },
];
