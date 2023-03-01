import { Button, Col, Form, Input, Row, Select, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import generateGuid from "../../../utils/generateGuid";
import Swal from "sweetalert2";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { formatosValidosFotoPerfil } from "../../../config";

const FormUsuarios = () => {
  const navigate = useNavigate();
  const [datosUsuario] = Form.useForm();
  const [loadingInternal, setLoadingInternal] = useState(false);
  const usersCollection = collection(db, "users");
  const [image, setImage] = useState(null);
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [isDetalle, setIsDetalle] = useState(false);
  const ImgLabel = "Seleccionar Imagen";

  const onFinish = async (values) => {
    setLoadingInternal(true);
    const user = location?.state?.modelo;
    if (user != null) {
      const userRef = doc(db, "users", user.idDoc);
      await updateDoc(userRef, {
        firstName: values.nombre,
        lastName: values.apellido,
        mail: values.correo,
        numPhone: values.numTelefono,
        password: values.contrasenia,
        rol: values.rol,
        userName: values.nombreUsuario,
      }).then(async () => {
        if (image !== null && image !== undefined && image !== user.urlImage) {
          try {
            const idDoc = user.idDoc;
            await UploadImage(image, idDoc);
          } catch (error) {
            console.error(error);
            Swal.fire(
              "Advertencia",
              "Ha ocurrido un error al subir la foto de perfil.",
              "error"
            );
          }
        } else{
          if(user.urlImage !== null && user.urlImage !== undefined && user.ulrImage !== "" && (image === null || image === undefined) ){
            await RemoveImage(user.urlImage, user.idDoc);
          }
        }
        Swal.fire({
          icon: "success",
          title: "¡ÉXITO!",
          text: "El usuario ha sido actualizado con éxito.",
          confirmButtonText: `Aceptar`,
        }).then(() => {
          navigate("/usuarios", {
            state: {
              refetch: true,
            },
          });
        });
      });
    } else {
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
          if (image !== null && image !== undefined) {
            try {
              const idDoc = data.id;
              await UploadImage(image, idDoc);
            } catch (error) {
              console.error(error);
              Swal.fire(
                "Advertencia",
                "Ha ocurrido un error al subir la foto de perfil.",
                "error"
              );
            }
          }

          Swal.fire({
            icon: "success",
            title: "¡ÉXITO!",
            text: "El usuario ha sido registrado con éxito.",
            confirmButtonText: `Aceptar`,
          }).then(() => {
            navigate("/usuarios", {
              state: {
                refetch: true,
              },
            });
          });
        },
        (error) => {
          console.log(error);
          Swal.fire("Advertencia", "Ha ocurrido un error inesperado.", "error");
        }
      );
    }
    setLoadingInternal(false);
  };

  const UploadImage = async (file, idDoc) => {
    const storageRef = ref(storage, "images/" + generateGuid());
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    //AGREGAR LA URL AL USUARIO
    const userRef = doc(db, "users", idDoc);
    await updateDoc(userRef, {
      urlImage: url,
    });
  };

  const RemoveImage = async (url, idDoc) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);

    //REMOVER LA URL AL USUARIO
    const userRef = doc(db, "users", idDoc);
    await updateDoc(userRef, {
      urlImage: "",
    });
  }

  useEffect(() => {
    if (location.state) {
      if (location.state.modelo) {
        const user = location.state.modelo;
        setIsDetalle(location.state.isDetalle);
        setUsuario(user);
        datosUsuario.setFieldsValue({
          nombre: user.firstName,
          apellido: user.lastName,
          nombreUsuario: user.userName,
          numTelefono: user.numPhone,
          correo: user.mail,
          contrasenia: user.password,
          rol: user.rol,
        });
        if (user.urlImage !== null && user.urlImage !== "") {
          setImage(user.urlImage);
          document
            .getElementById("img_user")
            .setAttribute("src", user.urlImage);
          document.getElementById("img_user").style.display = "initial";
          const containerElement = document.getElementById("thumbnail");
          containerElement.style.display = "initial";

          const labelElement = document.getElementById("img_label");
          labelElement.style.display = "none";
        }
      }
    }
  }, [location.state]);

  const SeleccionarImagen = () => {
    document.getElementById("file_img").click();
  };

  const SubirImagen = (e) => {
    const [file] = e.target.files;
    if (!validarArchivo(file)) {
      Swal.fire({
        title: "",
        icon: "warning",
        text: "Formato de archivo no válido",
      });
    } else{
      setImage(e.target.files[0]);
      const imgElement = document.getElementById("img_user");
      imgElement.setAttribute("src", URL.createObjectURL(file));
      imgElement.style.display = "initial";
  
      const containerElement = document.getElementById("thumbnail");
      containerElement.style.display = "initial";
  
      const labelElement = document.getElementById("img_label");
      labelElement.style.display = "none";
    }
  };

  const validarArchivo = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    return !!formatosValidosFotoPerfil.find((x) => x === fileExtension);
  };

  const RemoverImagen = () => {
    const file = document.getElementById("file_img");
    file.value = "";

    setImage(null);
    const imgElement = document.getElementById("img_user");
    imgElement.setAttribute("src", "");
    imgElement.style.display = "none";

    const containerElement = document.getElementById("thumbnail");
    containerElement.style.display = "none";

    const labelElement = document.getElementById("img_label");
    labelElement.style.display = "initial";
  };


  return (
    <>
      <Spin spinning={loadingInternal}>
        <div style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "1.5rem" }}>{usuario === null ? "Agregar" : isDetalle ? "Detalle" : "Editar"} Usuario</div>
        <div>
          <span>Administración</span>/<span className="rutaAnteriorGeneral" onClick={() => navigate("/usuarios")}>Usuarios</span>/<span>{usuario === null ? "Agregar" : isDetalle ? "Detalle" : "Editar"} Usuario</span>
        </div>
        &nbsp;
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
                  justifyContent: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  overflow: "hidden",
                }}
                onClick={!isDetalle ? SeleccionarImagen : null}
              >
                <p
                  id="img_label"
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  {ImgLabel}
                </p>
                <div
                  id="thumbnail"
                  style={{
                    position: "relative",
                    height: "15vw",
                    width: "15vw",
                    display: "none",
                    overflow: "hidden",
                  }}
                >
                  <img
                    id="img_user"
                    alt="Image"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      height: "100%",
                      width: "auto",
                      WebkitTransform: "translate(-50%, -50%)",
                      msTransform: "translate(-50%, -50%)",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
                <label>
                  <input
                    id="file_img"
                    type={"file"}
                    style={{ display: "none" }}
                    disabled={isDetalle}
                    onChange={(e) => SubirImagen(e)}
                  />
                </label>
              </div>
              &nbsp;
              <div hidden={image === null || image === undefined || isDetalle}>
                <Button danger onClick={RemoverImagen}>Remover Imagen</Button>
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
                    <Input disabled={isDetalle} placeholder="Nombre(s)" />
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
                    <Input disabled={isDetalle} placeholder="Apellido(s)" />
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
                    <Input disabled={isDetalle} placeholder="Nombre de Usuario" autoComplete="off" />
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
                    <Input disabled={isDetalle} placeholder="Número de Teléfono" />
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
                    <Input disabled={isDetalle} placeholder="correo" />
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
                    <Input.Password disabled={isDetalle} placeholder="correo" />
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
                      disabled={isDetalle}
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
              className="btnPrimario"
            >
              {"Cancelar"}
            </Button>
            &nbsp;
            <Button type="primary" className="btnPrimario" htmlType="submit" disabled={isDetalle}>
              Guardar
            </Button>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default FormUsuarios;
