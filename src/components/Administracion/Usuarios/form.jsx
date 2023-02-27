import { Button, Col, Form, Input, Row, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ListaRoles } from "../../pipes/enums";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  addDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase/firebase";
import { useState } from "react";
import generateGuid from "../../../utils/generateGuid";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const FormUsuarios = () => {
  const navigate = useNavigate();
  const [datosUsuario] = Form.useForm();
  const [loadingInternal, setLoadingInternal] = useState(false);
  const usersCollection = collection(db, "users");
  const [image, setImage] = useState(null);

  const onFinish = async (values) => {
    setLoadingInternal(true);
    const id = generateGuid();
    await addDoc(usersCollection, {
      id: id,
      firstName: values.nombre,
      lastName: values.apellido,
      mail: values.correo,
      numPhone: values.numTelefono,
      password: values.contrasenia,
      rol: values.rol,
      userName: values.nombreUsuario,
    }).then(
      async (data) => {
        if(image !== null && image !== undefined){
          try {
            const idDoc = data.id;
            await UploadImage(image, idDoc);
          } catch (error) {
            console.error(error);
            Swal.fire("Advertencia", "Ha ocurrido un error al subir la foto de perfil.", "error");
          }
        }
          
        Swal.fire({
          icon: "success",
          title: "¡ÉXITO!",
          text: "El usuario ha sido registrado con éxito.",
          confirmButtonText: `Aceptar`,
        }).then(() => {
          navigate("/usuarios");
        });
      },
      (error) => {
        console.log(error);
        Swal.fire("Advertencia", "Ha ocurrido un error inesperado.", "error");
      }
    );
    setLoadingInternal(false);
  };

  const UploadImage = async (file, idDoc) => {
    const storageRef = ref(storage, "images/" + generateGuid());
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    //AGREGAR LA URL AL USUARIO
    const userRef = doc(db, "users", idDoc);
    await updateDoc(userRef, {
      urlImage: url
    });
  }

  // const obtenerDatos = () => {
  //   const getUsers = async () => {
  //     const data = await getDocs(usuariosCollection);

  //     setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  // };

  // const deleteUser = async (id) => {
  //   const userDoc = doc(db, "users", id);
  //   await deleteDoc(userDoc);
  //   obtenerDatos();
  // }

  return (
    <>
      <Spin spinning={loadingInternal}>
        <div>AGREGAR USUARIO</div>
        <div>
          <span>Administración</span>/<span>Usuarios</span>
        </div>
        <Form
          layout="vertical"
          style={{ marginTop: "2vw" }}
          form={datosUsuario}
          onFinish={onFinish}
          autoComplete="off"
          className="formGeneral"
        >
          <Row gutter={16}>
            <Col span={5}>
              <div
                style={{
                  border: "1px",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderRadius: "50%",
                  width: "15vw",
                  height: "15vw",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <label>
                  <input type={"file"} style={{ display: "none" }} onChange={(e) => setImage(e.target.files[0])} />
                  Subir Imagen
                </label>
              </div>
            </Col>
            <Col span={19}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={"Nombre(s)"}
                    name="nombre"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar nombre.",
                      },
                    ]}
                    normalize={(input) => input.toUpperCase()}
                  >
                    <Input placeholder="Nombre(s)" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={"Apellido(s)"}
                    name="apellido"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar apellido.",
                      },
                    ]}
                    normalize={(input) => input.toUpperCase()}
                  >
                    <Input placeholder="Apellido(s)" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={"Nombre de Usuario"}
                    name="nombreUsuario"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar nombre de usuario.",
                      },
                    ]}
                  >
                    <Input placeholder="Nombre de Usuario" autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={"Número de Teléfono"}
                    name="numTelefono"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar número de teléfono.",
                      },
                    ]}
                  >
                    <Input placeholder="Número de Teléfono" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={"Correo"}
                    name="correo"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar correo.",
                      },
                      {
                        type: "email",
                        message: "El correo no es válido.",
                      },
                    ]}
                  >
                    <Input placeholder="correo" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={"Contraseña"}
                    name="contrasenia"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar contraseña.",
                      },
                    ]}
                  >
                    <Input.Password placeholder="correo" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Rol"
                    name={"rol"}
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresar rol.",
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Rol"}
                      allowClear
                      notFoundContent={"Sin opciónes"}
                      style={{
                        fontFamily: "TodaySHOP-Regular",
                        fontSize: "1.2vw",
                        width: "100%",
                      }}
                    >
                      {ListaRoles.map((item, key) => (
                        <Select.Option value={item.value} key={key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ justifyContent: "right" }}>
            <Button
              onClick={() => navigate("/usuarios")}
              style={{
                fontFamily: "TodaySHOP-Regular",
                fontSize: "1.2vw",
                height: "fit-content",
                marginRight: "1vw",
              }}
            >
              {"Cancelar"}
            </Button>
            <Button className="btnPrimario" htmlType="submit">
              Guardar
            </Button>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default FormUsuarios;
