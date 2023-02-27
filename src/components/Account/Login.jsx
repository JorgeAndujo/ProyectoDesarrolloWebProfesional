import { Button, Col, Form, Image, Input, Row } from "antd";
import FormItem from "antd/es/form/FormItem";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../firebase/firebase";
import { setLoggedInfo } from "../../utils/loggedInfo";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadingInternal, setLoadingInternal] = useState(false);

  const onSubmit = async (value) => {
    setLoadingInternal(true);
    try {
      const docRef = query(
        collection(db, "users"),
        where("userName", "==", value.usuario)
      );
      const user = await getDocs(docRef);
      if (!user.empty) {
        const userData = user.docs
          .map((doc) => ({ idDoc: doc.id, ...doc.data() }))
          .find((x) => x.userName === value.usuario);
        if (
          (value.usuario === userData.userName ||
            value.usuario === userData.mail) &&
          value.contra === userData.password
        ) {
          Swal.fire({
            icon: "success",
            title: "¡ÉXITO!",
            text: "Se ha iniciado sesión correctamente",
            confirmButtonText: `Aceptar`,
          }).then(() => {
            localStorage.setItem("session", "true");
            setLoggedInfo(userData);
            navigate("/inicio");
          });
        } else {
          Swal.fire("Advertencia!", "La contraseña es incorrecta.", "error");
        }
      } else {
        Swal.fire("Advertencia!", "El usuario ingresado no existe.", "error");
      }
      setLoadingInternal(false);
    } catch (error) {
      console.log(error);
      setLoadingInternal(false);
    }
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundSize: "cover",
          backgroundImage: 'url("../fondo.jpg")',
        }}
      >
        <div
          style={{
            width: "85%",
            borderRadius: "1vw",
            backgroundColor: "#FFFFFF",
            backgroundSize: "cover",
            height: "fit-content",
            boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.15)",
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ backgroundColor: "#15458D", height: "35vw" }}>
                <Image
                  src="./Logo.png"
                  width={"15vw"}
                  preview={false}
                  style={{ marginTop: "8vw" }}
                />
              </div>
            </Col>
            <Col span={16}>
              <div style={{ width: "100%" }}>
                <div style={{ display: "inline-flex", marginTop: "5vw" }}>
                  <Image src="./Logo.png" width={"7vw"} preview={false} />
                  <div style={{ fontSize: "larger" }}>
                    &nbsp;<p style={{ margin: "0" }}>SISTEMA DE INVENTARIO</p>{" "}
                    <p style={{ margin: "0" }}>PARA MINISUPER</p>
                  </div>
                </div>
              </div>
              <Form
                form={form}
                layout={"vertical"}
                onFinish={(e) => onSubmit(e)}
              >
                <div style={{ marginTop: "3vw" }}>
                  <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                      {" "}
                      <FormItem label={"Usuario"} name={"usuario"}>
                        <Input placeholder="Escriba su nombre de usuario" />
                      </FormItem>
                    </Col>
                    <Col span={6}></Col>
                  </Row>
                  <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                      {" "}
                      <FormItem label={"Contraseña"} name={"contra"}>
                        <Input.Password placeholder="Escriba su contraseña" />
                      </FormItem>
                    </Col>
                    <Col span={6}></Col>
                  </Row>
                </div>
                <div>
                  <Button type="primary" htmlType="submit">
                    INICIAR SESION
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Login;
