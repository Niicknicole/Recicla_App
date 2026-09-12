import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import app from "../firebase";

function RotaProtegida({ children }) {
  const auth = getAuth(app);

  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaProtegida;