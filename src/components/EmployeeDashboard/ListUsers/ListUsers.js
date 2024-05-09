import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function createData(
  email,
  emailVerified,
  uid,
  displayName,
  phoneNumber,
  action
) {
  return { email, emailVerified, uid, displayName, phoneNumber, action };
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ListUsers = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [successStatus, setSuccessStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);

  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee-list-users")
      .then((data) => setUsers(data.data))
      .catch((err) => console.log(err));
  }, [successStatus]);

  useEffect(() => {
    const usersRows = users.map((user) =>
      createData(
        user?.email,
        user?.emailVerified,
        user?.uid,
        user?.displayName,
        user?.phoneNumber
      )
    );
    setRows(usersRows);
  }, [users]);
  //   console.log(rows);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
      verified: verified,
      displayName: displayName,
      uid: uid,
      phone: phone,
    };
    await axios
      .put("http://localhost:8080/employee-update-user", body)
      .then((data) => {
        setSuccessStatus(data?.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Email</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell align="right">UID</TableCell>
              <TableCell align="right">Display Name</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row?.email}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row?.email}
                </TableCell>
                <TableCell align="right">
                  {row?.emailVerified ? "Verified" : "Not verified"}
                </TableCell>
                <TableCell align="right">{row?.uid}</TableCell>
                <TableCell align="right">{row?.displayName}</TableCell>
                <TableCell align="right">{row?.phoneNumber}</TableCell>
                <Button
                  onClick={() => {
                    handleOpen();
                    setUid(row?.uid);
                    setEmail(row?.email);
                    setVerified(row?.verified);
                    setDisplayName(row?.displayName);
                    setPhone(row?.phoneNumber);
                  }}
                >
                  <TableCell align="right">Edit User</TableCell>
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Update client details
          </Typography>
          <form
            onSubmit={(event) => handleSubmit(event)}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Change Email"
              variant="outlined"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              id="outlined-basic"
              label="Change Name"
              variant="outlined"
              defaultValue={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
              fullWidth
              id="outlined-basic"
              error={
                successStatus !== "Successful" &&
                successStatus.length > 0 &&
                true
              }
              label="Change Phone Number"
              variant="outlined"
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              fullWidth
              id="outlined-basic"
              label="Change Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Verified Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Verified Status"
                onChange={(e) => setVerified(e.target.value)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
            {successStatus && (
              <Typography
                sx={{
                  color: `${successStatus === "Successful" ? "green" : "red"}`,
                }}
              >
                {successStatus}
              </Typography>
            )}
            <Button type="submit">Update The User</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ListUsers;
