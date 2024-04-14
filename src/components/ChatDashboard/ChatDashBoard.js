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
    <div>
      {employee?.map((employee) => (
        <div key={employee?.email}>
          <Typography>{employee?.email}</Typography>
          <Link to={`/user-dashboard/chat/${employee?._id}`} >Chat</Link>
        </div>
      ))}
    </div>
  );
};

export default ChatDashBoard;
