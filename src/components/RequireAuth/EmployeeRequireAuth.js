import { useAuthState } from "react-firebase-hooks/auth";

import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { employeeAuth } from "../../firebase.config";

export default function EmployeeRequireAuth({ children }) {
  const [user, loading, error] = useAuthState(employeeAuth);
  const [isEmployee, setIsEmployee] = useState(null); // Use `null` to represent the initial unknown state
  let location = useLocation();

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8080/admin/employee/${user?.email}`)
        .then((data) => {
          console.log(data);
          if (data.data) {
            setIsEmployee(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsEmployee(false); // Set isAdmin to false if there's an error
        });
    } else {
      setIsEmployee(false); // Set isAdmin to false if there's no user
    }
  }, [user]);

  if (loading) {
    // You might want to render a loading spinner or some loading state
    return null;
  }

  if (isEmployee === null) {
    // If isAdmin is still unknown, return null or loading state
    return null;
  }

  if (isEmployee) {
    // Render the child components only if the user is an admin
    return children;
  } else if (user) {
    // Redirect to admin login if the user is not an admin
    return <Navigate to="/employee-login" state={{ from: location }} replace />;
  } else {
    // Handle the case where the user is not authenticated
    return <Navigate to="/employee-login" state={{ from: location }} replace />;
  }
}
