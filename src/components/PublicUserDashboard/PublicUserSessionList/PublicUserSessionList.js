import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth, publicUserAuth } from "../../../firebase.config";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
function createData(employeeEmail, date, startTime, id) {
  return { employeeEmail, date, startTime, id };
}
const PublicUserSessionList = () => {
  const [session, setSession] = useState([]);
  const [user] = useAuthState(publicUserAuth);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/booking/${user?.email}`)
      .then((data) => {
        setSession(data.data);
        console.log(data.data);
        const result = data.data.map((data) =>
          createData(data?.employeeEmail, data?.date, data.startTime, data._id)
        );
        setRows(result);
      })
      .catch((err) => console.log(err));
  }, [user]);
  console.log(session);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Email</TableCell>
            <TableCell>Session Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>{row?.employeeEmail}</TableCell>
              <TableCell>{row?.date}</TableCell>
              <TableCell>{row?.startTime}</TableCell>
              <TableCell>
                <Link to={`${row?.id}`}>
                  <Button>Join</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PublicUserSessionList;
