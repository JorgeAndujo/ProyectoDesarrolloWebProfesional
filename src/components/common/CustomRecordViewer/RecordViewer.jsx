import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Row,
  Empty,
  Tooltip,
  Space,
  Checkbox,
  Select,
  InputNumber,
  DatePicker,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  StopOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { usuarioLogueado } from "../../../utils/loggedInfo";

const { Column } = Table;

const CustomRecordViewer = ({
  data,
  columns,
  actions,
  onActionClick = () => null,
  loading = false,
  withFiltros = false,
  searchPlaceholder,
  setSearchTerm,
  botonAdd = true,
  textoBotonAdd,
  textoBotonAddState = undefined,
  botonAddCustomFunc = null,
  filtros,
  pagina = 0,
  setPagina = () => null,
  setTamanioPagina = () => null,
  activo = true,
  setActivo = () => null,
  disableSwitchActivo = false,
  mostrarOpcionesPorPagina = false,
  opcionesTamanioPagina = [10, 50, 100],
  textoItemsPorPagina = "/ por página",
  tamanioPagina = 10,
  setOrdenAsc = () => null,
  ordenAsc = false,
  totalItems = 0,
  botonOrdenamiento = false,
  isRechazos = false,
  isCancelados = false,
  isFiltroBusqueda = true,
  isFiltroActivoByInactivos = true,
  onRowFieldChange = () => null,
  setData,
}) => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const dateFormat = "DD/MM/YYYY";
  const usuario = usuarioLogueado();
  const onFieldChange = (rowFieldChangeData) => {
    onRowFieldChange(rowFieldChangeData);
  };
  const renderColum = ({
    render,
    value,
    row,
    inputType,
    inputText,
    dataIndex,
    inputHeader,
    inputFooter,
    disabledInput,
    checkAll,
    placeholderInput,
    formatoMoneda,
    inputWidth,
  }) => {
    if (render) {
      return render(value, row);
    }

    let disabled = false;
    if (disabledInput !== null && disabledInput !== undefined) {
      for (const condition of disabledInput) {
        if (row[condition]) {
          disabled = true;
        }
      }
    }

    if (inputType === "checkbox" && disabled) {
      return (
        <Checkbox
          key={dataIndex + "-" + pagina}
          checked={row[dataIndex]}
          onChange={(e) => {
            onFieldChange({
              key: dataIndex,
              value: e.target.checked,
              row,
            });
          }}
        />
      );
    }

    if (inputType === "select") {
      return (
        <Select
          placeholder="Seleccione Estatus"
          value={row[dataIndex]}
          key={dataIndex + "-" + pagina}
          disabled={disabled}
          style={{
            fontFamily: "TodaySHOP-Regular",
            fontSize: "1.2vw",
            width: "100%",
          }}
          notFoundContent={"Sin opciones"}
          allowClear
          onChange={(e) => {
            onFieldChange({
              key: dataIndex,
              value: e,
              row,
            });
          }}
        >
        </Select>
      );
    }

    if (inputType === "inputNumber") {
      return (
        <>
          {inputHeader && inputHeader(value, row)}
          <InputNumber
            disabled={disabled}
            value={row[dataIndex]}
            key={dataIndex + "-" + pagina}
            placeholder={placeholderInput}
            type={formatoMoneda === "true" ? null : "number"}
            style={{
              textAlign: "center",
              width: inputWidth === "true" ? "60%" : "auto",
            }}
            formatter={
              formatoMoneda === "true"
                ? (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : null
            }
            parser={
              formatoMoneda === "true"
                ? (value) => value.replace(/\$\s?|(,*)/g, "")
                : null
            }
            min={row?.inputMinValue || 0}
            max={row?.inputMaxValue}
            onChange={(changeValue) => {
              if (changeValue < 0) return;
              onFieldChange({ key: dataIndex, value: changeValue, row });
            }}
          />{" "}
          {inputText}{" "}
          {inputFooter && inputFooter(value, row)}
        </>
      );
    }

    if (inputType === "inputDate") {
      return (
        <>
          <DatePicker
            disabled={disabled}
            value={row.fecha}
            key={dataIndex + "-" + pagina}
            format={dateFormat}
            style={{
              fontFamily: "TodaySHOP-Regular",
              fontSize: "1.2vw",
              width: "100%",
            }}
            placeholder="DD/MM/AAAA"
            onChange={(changeValue) => {
              if (changeValue < 0) return;
              onFieldChange({ key: dataIndex, value: changeValue, row });
            }}
          />
        </>
      );
    }

    if (inputType === "inputText") {
      return (
        <>
          <Input
            disabled={disabled}
            value={row[dataIndex]}
            key={dataIndex + "-" + pagina}
            style={{
              fontFamily: "TodaySHOP-Regular",
              fontSize: "1.2vw",
              width: "100%",
            }}
            onChange={(changeValue) => {
              if (changeValue < 0) return;
              onFieldChange({
                key: dataIndex,
                value: changeValue.target.value,
                row,
              });
            }}
          />
        </>
      );
    }

    return value;
  };

  return (
    <>
      <div
        style={
          !isFiltroBusqueda && !isFiltroActivoByInactivos
            ? {}
            : { display: "flex", marginBottom: "1vw", marginTop: "1vw" }
        }
      >
        {activo && botonAdd && (
          <Button
            disabled={loading}
            onClick={() => {
              if (botonAddCustomFunc !== null) {
                return botonAddCustomFunc();
              } else return navigate("./form", { state: textoBotonAddState });
            }}
            style={{
              fontSize: "1.2vw",
              fontFamily: "TodaySHOP-Regular",
              height: "fit-content",
              marginRight: "1vw",
            }}
          >
            {textoBotonAdd}
          </Button>
        )}
        {isFiltroBusqueda && (
          <Input
            value={term.toUpperCase()}
            autoComplete={false}
            style={{
              fontSize: "1.2vw",
              fontFamily: "TodaySHOP-Regular",
            }}
            onChange={(e) => {
              if (e.target.value != "") {
                setTerm(e.currentTarget.value);
              } else {
                setTerm("");
                setSearchTerm("");
              }
            }}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                setPagina(0);
                setSearchTerm(term);
              }
            }}
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
          />
        )}
        {isFiltroActivoByInactivos &&
          (isFiltroBusqueda === false ? (
            <div
              style={isFiltroBusqueda === false ? { marginLeft: "auto" } : {}}
            >
              <Tooltip title={"Activos"}>
                <Button
                  disabled={activo || disableSwitchActivo}
                  className={`${!activo && "btnActInc"} ${
                    activo && "btnActivo"
                  }`}
                  style={{
                    fontSize: "1.2vw",
                    height: "fit-content",
                  }}
                  onClick={() => {
                    setPagina(0)
                    setActivo(true)
                  }}
                >
                  <CheckCircleOutlined />
                </Button>
              </Tooltip>

              <Tooltip
                title={
                  isRechazos
                    ? "Rechazados"
                    : isCancelados
                    ? "Canceladas"
                    : "Inactivos"
                }
              >
                <Button
                  disabled={!activo || disableSwitchActivo}
                  className={`${activo && "btnActInc"} ${
                    !activo && "btnActivo"
                  }`}
                  style={{
                    fontSize: "1.2vw",
                    height: "fit-content",
                  }}
                  onClick={() => {
                    setPagina(0);
                    setActivo(false)
                  }}
                >
                  {isRechazos ? <CloseCircleOutlined /> : <StopOutlined />}
                </Button>
              </Tooltip>
            </div>
          ) : (
            <>
              <Tooltip title={"Activos"}>
                <Button
                  disabled={activo || disableSwitchActivo}
                  className={`${!activo && "btnActInc"} ${
                    activo && "btnActivo"
                  }`}
                  style={{
                    fontSize: "1.2vw",
                    height: "fit-content",
                  }}
                  onClick={() => {
                    setPagina(0)
                    setActivo(true)
                  }}
                >
                  <CheckCircleOutlined />
                </Button>
              </Tooltip>

              <Tooltip
                title={
                  isRechazos
                    ? "Rechazados"
                    : isCancelados
                    ? "Canceladas"
                    : "Inactivos"
                }
              >
                <Button
                  disabled={!activo || disableSwitchActivo}
                  className={`${activo && "btnActInc"} ${
                    !activo && "btnActivo"
                  }`}
                  style={{
                    fontSize: "1.2vw",
                    height: "fit-content",
                  }}
                  onClick={() => {
                    setPagina(0)
                    setActivo(false)
                  }}
                >
                  {isRechazos ? <CloseCircleOutlined /> : <StopOutlined />}
                </Button>
              </Tooltip>
            </>
          ))}

        {botonOrdenamiento && (
          <Button
            type="link"
            style={{
              fontSize: "1.2vw",
              fontFamily: "TodaySHOP-Regular",
              width: "10vw",
              marginLeft: "12vw",
              textAlign: "right",
            }}
            onClick={() => setOrdenAsc(!ordenAsc)}
          >
            {ordenAsc ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            Ordenar
          </Button>
        )}
      </div>
      {withFiltros && (
        <Row gutter={16} style={{ marginBottom: "1vw" }}>
          {filtros}
        </Row>
      )}
      <Table
        locale={{
          emptyText: <Empty description="Sin registros" />,
        }}
        loading={loading}
        dataSource={data}
        pagination={{
          showSizeChanger: mostrarOpcionesPorPagina,
          pageSizeOptions: opcionesTamanioPagina,
          current: pagina + 1,
          pageSize: tamanioPagina,
          showTotal: (totalItems) => `Registros encontrados ${totalItems} `,
          locale: {
            items_per_page: ` ${textoItemsPorPagina}`,
          },
          onChange: (pagina, tamanioPagina) => {
            setPagina(pagina - 1);
            setTamanioPagina(tamanioPagina);
          },
          total: totalItems,
        }}
      >
        {columns.map(
          ({
            title,
            dataIndex,
            key,
            render,
            inputType,
            inputHeader,
            inputFooter,
            disabledInput,
            checkAll,
            placeholderInput,
            formatoMoneda,
            inputWidth,
          }) => {
            return (
              <Column
                className="columnStyle"
                title={
                  checkAll === "true" ? (
                    data?.filter((x) => x.isHabilitarCheckbox === true)
                      .length === 0 ? (
                      ""
                    ) : (
                      <Checkbox
                        disabled={
                          data?.filter((x) => x.isHabilitarCheckbox === true)
                            .length === 0
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setData(
                            data?.map((x) => ({
                              ...x,
                              [dataIndex]: x.isHabilitarCheckbox
                                ? e.target.checked
                                : false,
                            }))
                          );
                        }}
                      />
                    )
                  ) : (
                    title
                  )
                }
                dataIndex={dataIndex}
                key={key}
                render={(value, row) =>
                  renderColum({
                    value,
                    row,
                    render,
                    inputType,
                    dataIndex,
                    disabledInput,
                    checkAll,
                    placeholderInput,
                    formatoMoneda,
                    inputWidth,
                    inputHeader,
                    inputFooter
                  })
                }
              />
            );
          }
        )}
        {actions && (
          <Column
            key={"actions"}
            title={"Opciones"}
            align={"center"}
            render={(_, row, index) => (
              <Space size="middle">
                {actions.map(
                  ({
                    key,
                    navigate,
                    showIf = null,
                    icon,
                    tooltip,
                    render,
                    roles = [],
                  }) => {
                    let showIcon = false;
                    if (showIf !== null) {
                      for (const condition of showIf) {
                        if (typeof condition === "function") {
                          if (condition(row)) showIcon = true;
                        } else if (row[condition]) {
                          showIcon = true;
                        }
                      }
                    } else showIcon = true;

                    if (showIcon) {
                      if (render) {
                        if (
                          roles.length > 0 &&
                          roles.find((x) => x === usuario.rol)
                        )
                          return null;
                        else {
                          return render(key, row);
                        }
                      }
                      if (roles.length > 0) {
                        if (roles.find((x) => x === usuario.rol)) {
                          return (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                navigate
                                  ? navigate(navigate)
                                  : onActionClick(key, row, index)
                              }
                            >
                              <Tooltip title={tooltip}>{icon}</Tooltip>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      } else {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate
                                ? navigate(navigate)
                                : onActionClick(key, row, index)
                            }
                          >
                            <Tooltip title={tooltip}>{icon}</Tooltip>
                          </div>
                        );
                      }
                    }
                  }
                )}
              </Space>
            )}
          />
        )}
      </Table>
    </>
  );
};

export default CustomRecordViewer;
