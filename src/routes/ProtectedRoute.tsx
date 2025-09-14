import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { token, exp } = useSelector((s: RootState) => s.auth);
  const location = useLocation();
  const expired = !token || !exp || Date.now() > exp;
  if (expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
