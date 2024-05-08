import { useAuthState } from "react-firebase-hooks/auth";

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { publicUserAuth } from "../../firebase.config";

export default function PublicUserRequireAuth({ children }) {
  const [user, loading, error] = useAuthState(publicUserAuth);
  const [isUser, setIsUser] = useState(null); // Use `null` to represent the initial unknown state
  let location = useLocation();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8080/public-user/${user?.email}`)
        .then((data) => {
          if (data.data) {
            setIsUser(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsUser(false);
        });
    } else {
      setIsUser(false);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (isUser === null) {
    return null;
  }

  if (isUser) {
    return children;
  } else if (user) {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }
}
