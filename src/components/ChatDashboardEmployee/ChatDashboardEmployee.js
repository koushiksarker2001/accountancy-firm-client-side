import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatDashBoardEmployee = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/public-user")
      .then((data) => setUser(data.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      {user?.map((user) => (
        <div key={user?.email}>
          <Typography>{user?.email}</Typography>
          <Link to={`/employee-dashboard/chat/${user?._id}`}>Chat</Link>
        </div>
      ))}
    </div>
  );
};

export default ChatDashBoardEmployee;
