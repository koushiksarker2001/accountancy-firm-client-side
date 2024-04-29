import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployeeSessionList = () => {
  const [session, setSession] = useState([]);
  const [user] = useAuthState(employeeAuth);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/booking/${user?.email}`)
      .then((data) => setSession(data.data))
      .catch((err) => console.log(err));
  }, [user]);
  console.log(session);
  return (
    <div>
      <table
        width="900"
        border="1"
        style={{ borderCollapse: "collapse", textAlign: "center" }}
      >
        <thead>
          <th>User Email</th>
          <th>User Session Time</th>
          <th>User Full Name</th>
          <th>Action</th>
        </thead>
        <tbody>
          {session.map((session) => (
            <tr>
              <td>{session?.userEmail}</td>
              <td>{session?.startTime}</td>
              <td>{session?.fullName}</td>
              <Link to={`${session?._id}`}>
                <button>Join</button>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSessionList;
