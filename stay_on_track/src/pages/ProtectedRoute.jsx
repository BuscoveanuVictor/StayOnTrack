import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    fetch("/auth/check", { credentials: "include" })
      .then(res => res.json())
      .then(data => setIsAuth(data.auth))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    // Poți pune un loader aici
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/auth/page" replace />;
  }

  return children;
}

export default ProtectedRoute;