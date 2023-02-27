export const usuarioLogueado = () => {
  const info = localStorage.getItem("usuarioInfo");
  return JSON.parse(info);
};

export const setLoggedInfo = (data) => {
  localStorage.setItem("usuarioInfo", JSON.stringify(data));
};
