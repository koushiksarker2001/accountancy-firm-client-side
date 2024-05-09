import { TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatDashBoardEmployee = () => {
  const [user, setUser] = useState([]);
  const [tempUser, setTempUser] = useState([]);
  const [email, setEmail] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8080/public-user")
      .then((data) => {
        setUser(data.data);
        setTempUser(data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const filteredUser = tempUser.filter((user) => user.email.includes(email));
    setUser(filteredUser);
  }, [email, tempUser]);
  return (
    <div>
      <TextField
        variant="outlined"
        label="Search by email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="all_employee">
        {user?.map((user) => (
          <div key={user?.email} className="group-37417">
            <div
              className="rectangle-59"
              style={{
                padding: "0px",
                height: "100%",
              }}
            >
              <div>
                <p className="employee-name">{user?.email}</p>
              </div>

              <Link
                to={`/employee-dashboard/chat/${user?._id}`}
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
    </div>
  );
};

export default ChatDashBoardEmployee;
