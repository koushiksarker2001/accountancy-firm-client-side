import { Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },

  title: {
    marginBottom: "8px",
  },
  button: {
    marginTop: "16px",
  },
};

const NotLoggedIn = ({ colorMode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        backgroundColor: `${colorMode == "light" ? "#ffffff" : "#090e10"}`,
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" style={styles.title}>
        Please log in/signup to book a session.
      </Typography>
      <Typography variant="body1" align="center"></Typography>
      <Link to="/user-login">
        <Button variant="contained" color="primary" style={styles.button}>
          Log In
        </Button>
      </Link>
    </div>
  );
};

export default NotLoggedIn;
