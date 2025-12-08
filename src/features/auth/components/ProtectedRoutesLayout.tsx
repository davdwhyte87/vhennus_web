import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../useAuthStore";


const ProtectedLayout = () => {
  const authStore = useAuthStore()

  if (authStore.isLoginLoading) return <div>Loading...</div>;

  return (authStore.token.length>10) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout