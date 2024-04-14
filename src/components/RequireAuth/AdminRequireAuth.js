import { useAuthState } from "react-firebase-hooks/auth";

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase.config";

export default function AdminRequireAuth({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null); // Use `null` to represent the initial unknown state
  let location = useLocation();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8080/admin/${user?.email}`)
        .then((data) => {
          if (data.data.email) {
            setIsAdmin(data.data.email);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsAdmin(false); // Set isAdmin to false if there's an error
        });
    } else {
      setIsAdmin(false); // Set isAdmin to false if there's no user
    }
  }, [user]);

  if (loading) {
    // You might want to render a loading spinner or some loading state
    return null;
  }

  if (isAdmin === null) {
    // If isAdmin is still unknown, return null or loading state
    return null;
  }

  if (isAdmin) {
    // Render the child components only if the user is an admin
    return children;
  } else if (user) {
    // Redirect to admin login if the user is not an admin
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  } else {
    // Handle the case where the user is not authenticated
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
}
