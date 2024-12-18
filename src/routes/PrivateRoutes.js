import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  // const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" exact />;
};

export default PrivateRoutes;
