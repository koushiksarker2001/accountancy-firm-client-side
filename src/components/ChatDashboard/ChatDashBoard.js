import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatDashBoard = () => {
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee")
      .then((data) => setEmployee(data.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="all_employee">
      {employee?.map((employee) => (
        <div key={employee?.email} className="group-37417">
          <div
            className="rectangle-59"
            style={{
              padding: "0px",
              height: "100%",
            }}
          >
            <div>
              <p className="employee-name">{employee?.email}</p>
            </div>

            <Link
              to={`/user-dashboard/chat/${employee?._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="group-btn">
                <div className="booking-button-custom">Chat</div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatDashBoard;
