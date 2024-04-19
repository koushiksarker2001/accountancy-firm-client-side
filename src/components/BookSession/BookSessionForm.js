import { Box, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { publicUserAuth } from "../../firebase.config";
const BookSessionForm = ({ parsedItem }) => {
  const [user] = useAuthState(publicUserAuth);
  const [companyName, setCompanyName] = useState();
  const [fullName, setFullName] = useState();
  // const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [status, setStatus] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      companyName: companyName,
      fullName: fullName,
      email: user?.email,
      phoneNumber: phoneNumber,
    };
    const newBody = { ...parsedItem, ...body };
    await axios
      .post("http://localhost:8080/booking", newBody)
      .then((data) => setStatus(data.data))
      .catch((err) => console.log(err));
  };
  return (
    <Box sx={{ width: "60%" }}>
      <Typography variant="h5" textAlign="center">
        Book a session!
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* company name */}
        <div>
          <TextField
            id="outlined-basic"
            label="Company Name"
            variant="outlined"
            fullWidth
            required
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        {/* full name */}
        <div>
          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {/* email */}
        <div style={{ margin: "2% 0" }}>
          <TextField
            disabled
            id="filled-disabled"
            label="Email"
            variant="filled"
            value={user?.email}
            fullWidth
          />
        </div>
        {/* phone number */}
        <div>
          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {status && <Typography>{status}</Typography>}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </Box>
  );
};

export default BookSessionForm;
