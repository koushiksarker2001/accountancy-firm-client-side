import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function createData(email, verified, uid, action) {
  return { email, verified, uid, action };
}

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee-list-users")
      .then((data) => setUsers(data.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const usersRows = users.map((user) =>
      createData(user?.email, user?.emailVerified, user?.uid)
    );
    setRows(usersRows);
  }, [users]);
  console.log(users);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Email</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell align="right">UID</TableCell>
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
                <Link to={`${row?.uid}`}>
                  <TableCell align="right">Edit User</TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListUsers;
